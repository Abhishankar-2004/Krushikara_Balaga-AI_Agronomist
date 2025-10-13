// Removed storageService - community data now handled differently with Clerk

export interface Comment {
    author: string;
    text: string;
}

export interface Post {
    id: number;
    author: string;
    location: string;
    text: string;
    imageUrl?: string;
    comments: Comment[];
    aiResponse?: string;
    likes: number;
    likedBy: string[];
}

const STORAGE_KEY = 'communityPosts';

const initialPosts: Post[] = [
    {
        id: 1,
        author: 'Ramesh K.',
        location: 'Mysuru, KA',
        text: 'My tomato plants are showing these strange yellow spots on the leaves. Any idea what this could be? I\'ve attached a photo.',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1667048123738-34994273c936?q=80&w=2070&auto=format&fit=crop',
        comments: [
            { author: 'Sunita G.', text: 'Looks like early blight. Try a neem oil spray.' },
            { author: 'Anand P.', text: 'I had this last year. A copper-based fungicide worked for me.' },
        ],
        aiResponse: '**Crop:** Tomato Plant\n**Diagnosis:** Early Blight (Alternaria solani)\n\n**Organic Remedies:**\n- Spray with a solution of neem oil (1-2 tsp) and mild soap in 1 liter of water.\n- Remove and destroy affected leaves to prevent spread.\n\n**Chemical Remedies:**\n- Apply fungicides containing mancozeb or chlorothalonil according to package directions.',
        likes: 15,
        likedBy: [],
    },
    {
        id: 2,
        author: 'Priya S.',
        location: 'Hubli, KA',
        text: 'Harvested my first batch of onions! The market price seems to be good this week. Planning to sell them at the Hubli APMC market tomorrow.',
        imageUrl: 'https://images.unsplash.com/photo-1588975823623-644783db37a9?q=80&w=2070&auto=format&fit=crop',
        comments: [
            { author: 'Ramesh K.', text: 'Congratulations! That\'s a great-looking harvest.' },
        ],
        likes: 28,
        likedBy: [],
    },
];

const initializePosts = (): Post[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let posts = stored ? JSON.parse(stored) : null;
    if (!posts || posts.length === 0) {
        posts = initialPosts;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
    // Ensure old posts have new properties
    posts.forEach(p => {
        if (p.likes === undefined) p.likes = 0;
        if (p.likedBy === undefined) p.likedBy = [];
    });
    return posts;
}

export const getPosts = (): Post[] => {
    const posts = initializePosts();
    return posts.sort((a, b) => b.id - a.id);
};

export const addPost = (post: Pick<Post, 'author' | 'location' | 'text' | 'imageUrl'>): Post => {
    const posts = getPosts();
    const newPost: Post = {
        ...post,
        id: Date.now(), // Using timestamp for unique ID
        comments: [],
        likes: 0,
        likedBy: [],
    };
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    return newPost;
};

export const addComment = (postId: number, author: string, text: string): Post | undefined => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return undefined;

    const newComment: Comment = { author, text };
    posts[postIndex].comments.push(newComment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts[postIndex];
};

export const toggleLike = (postId: number, userEmail: string): Post | undefined => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return undefined;

    const post = posts[postIndex];
    const likedIndex = post.likedBy.indexOf(userEmail);

    if (likedIndex === -1) {
        // User has not liked it yet, so add a like
        post.likes += 1;
        post.likedBy.push(userEmail);
    } else {
        // User has liked it, so remove the like
        post.likes -= 1;
        post.likedBy.splice(likedIndex, 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return post;
};
