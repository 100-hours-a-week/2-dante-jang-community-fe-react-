import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import DOMPurify from 'dompurify';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Code, Link as LinkIcon, Highlighter, Minus } from 'lucide-react';
import './style.css';
import { writePostRequest } from '../../apis/post';
import FormData from "form-data";

/**
 * @description `
 *   게시글 작성 후 작성 버튼을 클릭
 *   본문을 제외하고 title로만 게시글을 생성 -> api : createPostRequset(title:str)
 *   게시글의 image 테그를 파싱
 *   파싱한 이미지 테그중 src가 data를 담고 있다면 모두 배열로 전환
 *   해당 배열의 data들에 대하여 파일 이름을 {user_name}/post/{post_id}/{image_seq.확장자}로 바꾸고 S3에 저장 -> api : saveImageRequset(file:form-data)
 *   저장 이후 받은 url을 data와 치환
 *   해당 게시글의 본문을 업데이트 -> api : updatePostRequest(content:str)
 * `
 * @returns WritePost
 */
const WritePost = () => {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [linkUrl, setLinkUrl] = useState('');
    const characterLimit = 100000;

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

    const handleSubmit = async () => {
        const sanitizedTitle = sanitizeInput(title);
        if (!validateTitle(sanitizedTitle)) {
            return;
        }
        imageProcessing(sanitizeInput(editor.getHTML()));

        // const writePostResponse = await writePostRequest(sanitizedTitle, sanitizedContent, null);
        // console.log(writePostResponse);
    };

    const imageProcessing = async (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTags = doc.querySelectorAll('img');

        const promises = Array.from(imgTags).map(async (img) => {
            const src = img.getAttribute('src')
            if (src && src.startsWith('data:')) {
                const base64Data = src.split(',')[1];
                const formData = new FormData();
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
                {/* 에디터 본문 */}
                <EditorContent editor={editor} />
                {/* 에디터 하단부 */}
                <div className='editor-bottom'>
                    {/* 본문 글자 수 */}
                    <div className="character-count">
                        Character Count: {editor.storage.characterCount.characters()}/{characterLimit}
                    </div>
                    {/* 제출 버튼 */}
                    <button className="submit-btn" onClick={handleSubmit}>
                        제출
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePost;