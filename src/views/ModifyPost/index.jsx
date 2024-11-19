import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import DOMPurify from 'dompurify';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Code, Link as LinkIcon, Highlighter, Minus } from 'lucide-react';
import { getPostRequest, updatePostRequest } from '../../apis/post';
import FormData from "form-data";
import { v4 as uuidv4 } from 'uuid';
import { uploadImageRequest } from 'apis/image';
import { useParams, useNavigate } from 'react-router-dom';
import { POST_PATH, ERROR_PATH } from 'constants';

const ModifyPost = () => {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [linkUrl, setLinkUrl] = useState('');
    const navigate = useNavigate();
    const characterLimit = 100000;
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            CharacterCount.configure({ limit: characterLimit }),
            Color,
            Link,
        ],
        content: '<h1> 글을 작성해 주세요... </h1>',
        editorProps: {
            attributes: {
                class: 'editor-content',
            },
        },
    });

    useEffect(() => {
        const fetchPostData = async () => {
            const getPostResponse = await getPostRequest(postId);
            if (!getPostResponse) {
                navigate(ERROR_PATH());
                return;
            }

            setTitle(getPostResponse.post.title);
            setThumbnailImage(getPostResponse.post.image_url);
            editor.commands.setContent(getPostResponse.post.content);
        };

        fetchPostData();
    }, [postId, editor, navigate]);

    const addImage = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl(null)
        }
    }, [editor, imageUrl]);

    const setLink = useCallback(() => {
        if (linkUrl && editor) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
        }
    }, [editor, linkUrl]);

    const handleImageUpload = useCallback((event) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageUrl(e.target?.result)
            }
            reader.readAsDataURL(file)
        }
    }, []);

    const validateTitle = (title) => {
        if (title.length < 3 || title.length > 100) {
            alert('제목은 3자 이상 100자 이하로 입력해주세요.');
            return false;
        }
        return true;
    };

    const sanitizeInput = (input) => {
        return DOMPurify.sanitize(input);
    };

    const handleThumbnailClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailImage(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const sanitizedTitle = sanitizeInput(title);
        if (!validateTitle(sanitizedTitle)) {
            return;
        }

        const content = await imageProcessing(sanitizeInput(editor.getHTML()), postId);
        console.log(content);
        const updatePostResponse = await updatePostRequest(
            postId, 
            content, 
            sanitizedTitle, 
            await thumbnailProcessing(postId));
        console.log(updatePostResponse.postId);
        navigate(POST_PATH('unknown','unknown',postId));
    };

    const thumbnailProcessing = async (postId) => {
        if (!thumbnailFile) {
            return null;
        }

        const formData = new FormData();
        formData.append('file',thumbnailFile,`post-${postId}-thumbnail-${uuidv4()}`);
        const uploadImageResponse = await uploadImageRequest(formData);
        if (uploadImageResponse) {
            return uploadImageResponse.imageId;
        }
        alert("썸네일 등록 실패");
        return null;
    }

    const imageProcessing = async (content, postId) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTags = doc.querySelectorAll('img');

        const promises = Array.from(imgTags).map(async (img) => {
            const src = img.getAttribute('src')
            if (src && src.startsWith('data:')) {
                const base64Data = src.split(',')[1];
                const mimeType = src.match(/^data:(.*?);base64,/)[1];
                const extension = mimeType.split('/')[1];
                const imageName = `image_${uuidv4()}.${extension}`;

                const byteCharacters = atob(base64Data);
                const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                const formData = new FormData();
                formData.append(
                    'file',
                    blob,
                    `post-${postId}-${imageName}`
                );

                const uploadImageResponse = await uploadImageRequest(formData);
                if (uploadImageResponse) {
                    img.setAttribute('src', uploadImageResponse.imageId);
                }
            }
        });

        await Promise.all(promises);
        return doc.documentElement.outerHTML;
    }

    return (
        <div className="write-post-wrapper">
            {/* 타이틀 */}
            <div className='write-post-title'>
                <input
                    className='write-post-tile-input'
                    placeholder="제목"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    required
                >
                </input>
            </div>
            {/* 에디터 */}
            <div className="editor-container">
                {/* 에디터 툴바 */}
                <div className="editor-toolbar">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        <Bold className="icon" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        <Italic className="icon" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <List className="icon" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <ListOrdered className="icon" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={editor.isActive('codeBlock') ? 'is-active' : ''}
                    >
                        <Code className="icon" />
                    </button>
                    <select
                        onChange={(e) => editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run()}
                        className="editor-select"
                    >
                        <option value="">Heading</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                    </select>
                    <label htmlFor="image-upload" className="editor-button">
                        <ImageIcon className="icon" />
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden-input"
                    />
                    {imageUrl && (
                        <button onClick={addImage}>Insert Image</button>
                    )}
                    <div className="link-input-container">
                        <input
                            type="text"
                            placeholder="Enter link URL"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="link-input"
                        />
                        <button
                            onClick={setLink}
                            className={editor.isActive('link') ? 'is-active' : ''}
                        >
                            <LinkIcon className="icon" />
                        </button>
                    </div>
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={editor.isActive('highlight') ? 'is-active' : ''}
                    >
                        <Highlighter className="icon" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus className="icon" />
                    </button>
                </div>
                {/* 썸네일 */}
                <div className='thumbnail-section' onClick={handleThumbnailClick}>
                    {thumbnailImage ? (
                        <img src={thumbnailImage} alt="Thumbnail" className="thumbnail-preview" />
                    ) : (
                        <p className="thumbnail-placeholder">썸네일 이미지 추가</p>
                    )}
                    <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleThumbnailChange}
                        style={{ display: 'none' }}
                    />
                </div>
                {/* 에디터 본문 */}
                <EditorContent editor={editor} />
                {/* 에디터 하단부 */}
                <div className='editor-bottom'>
                    {/* 본문 글자 수 */}
                    <div className="character-count">
                        Character Count: {editor.storage.characterCount.characters()}/{characterLimit}
                    </div>
                    {/* 버튼 */}
                    <button className="submit-btn" onClick={handleSubmit}>
                        수정
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifyPost;