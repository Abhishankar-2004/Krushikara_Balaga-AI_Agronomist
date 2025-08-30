

import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserProfile, Feature } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { getAIResponseForPost } from '../services/geminiService';
import { getPosts, addPost, Post } from '../services/communityService';
import { UploadIcon } from './icons/UploadIcon';
import { CommunityIcon } from './icons/CommunityIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';


const CreatePost: React.FC<{ onPostCreated: (newPost: Post) => void, userProfile: UserProfile }> = ({ onPostCreated, userProfile }) => {
    const { language, translate } = useLanguage();
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!text.trim() || !userProfile.email) {
            setError(translate('postError'));
            return;
        }
        setIsLoading(true);
        setError('');

        const newPostData = {
            author: userProfile.name || translate('anonymousUser'),
            location: userProfile.location || translate('unknownLocation'),
            text: text,
            imageUrl: previewUrl ?? undefined,
        };

        let newPost = addPost(newPostData);

        try {
            const aiResultJson = await getAIResponseForPost(text, language, imageFile ?? undefined);
            const aiResult = JSON.parse(aiResultJson);
            if (aiResult.aiResponse) {
                newPost.aiResponse = aiResult.aiResponse;
            }
        } catch (e) {
            console.error("Failed to get AI response for post", e);
        }

        analyticsService.logFeatureUse(Feature.COMMUNITY_CONNECT, userProfile.email);
        onPostCreated(newPost);
        setText('');
        setImageFile(null);
        setPreviewUrl(null);
        setIsLoading(false);
    };

    return (
        <Card className="mb-8 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-bold text-primary mb-4">{translate('createPostButton')}</h3>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={translate('postPlaceholder')}
                className="w-full p-3 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                rows={3}
            />
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <label htmlFor="post-image-upload" className="cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    <span className="font-semibold">{translate('attachImageButton')}</span>
                    <input id="post-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner /> : translate('submitPostButton')}
                </Button>
            </div>
            {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 rounded-lg max-h-48 border-2 border-slate-200 dark:border-slate-700" />}
            {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
        </Card>
    );
};


const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const { translate } = useLanguage();

    return (
        <Card className="mb-6 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {post.author.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{post.author}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{translate('fromLocation').replace('{location}', post.location)}</p>
                </div>
            </div>
            <p className="my-4 text-slate-700 dark:text-slate-300 text-base whitespace-pre-wrap">{post.text}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt={translate('communityPostImageAlt').replace('{author}', post.author)} className="rounded-xl w-full max-h-96 object-cover mb-4 border-2 border-slate-200 dark:border-slate-800" />
            )}

            <div className="space-y-4">
                {post.aiResponse && (
                    <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-2">
                           <LightbulbIcon className="w-5 h-5"/> {translate('aiExpertOpinion')}
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">{post.aiResponse}</p>
                    </div>
                )}
                {post.comments.length > 0 && (
                     <div className="pt-4">
                        <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-3">{translate('comments')} ({post.comments.length})</h4>
                        <div className="space-y-3">
                        {post.comments.map((comment, index) => (
                            <div key={index} className="flex items-start gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                                    {comment.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{comment.author}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};


const CommunityConnect: React.FC<{ userProfile: UserProfile & { email: string } | null }> = ({ userProfile }) => {
    const { translate } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        setPosts(getPosts());
    }, []);

    const handlePostCreated = (newPost: Post) => {
        setPosts(prevPosts => [newPost, ...prevPosts.filter(p => p.id !== newPost.id)]);
    };
    
    if (!userProfile) {
        return null; // or a loading/error state
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3"><CommunityIcon className="w-8 h-8"/>{translate('communityConnectTitle')}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">{translate('communityConnectDescription')}</p>
            </div>
            
            <CreatePost onPostCreated={handlePostCreated} userProfile={userProfile} />

            <div className="mt-8">
                {posts.length > 0 ? (
                    posts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 mt-12">{translate('noPosts')}</p>
                )}
            </div>
        </div>
    );
};

export default CommunityConnect;