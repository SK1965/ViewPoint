import { useState, useEffect } from 'react';
import { Heart } from 'react-feather';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const QueryLike = ({ like, queryId }: { like: string[], queryId: string }) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(like);
  // This useEffect runs on session changes or page reloads
  useEffect(() => {
    if (session && session.user) {
      if(likes.includes(session.user._id.toString())){
        setLiked(true)
      }
    }
  }, [session, likes]);

  const handleClick = async () => {
    if (!session || !session.user) {
      router.push('/sign-in');
      return;
    }

    const userId = session.user._id.toString();
    
    // Update local liked state and likedQueries in session
    if (liked) {
      setLikes(likes.filter(id=>id!=userId))
    } else {
      setLikes([...likes , userId]);
    }

    setLiked(!liked);

    try {
      const response = await axios.post('/api/likesHandle/queryLikes', {queryId, userId});
      toast(response.data.message);
    } catch (error) {
      console.error(error);
      toast('Like function failed');
    }
  };
  
  return (
    <div className="flex-col text-center items-center justify-center">
      <Heart
        className={` ${liked ? "fill-red-600 text-red-500" : ""}`}
        onClick={handleClick}
      />
      <span>{likes.length}</span>
    </div>
  );
};

export default QueryLike;
