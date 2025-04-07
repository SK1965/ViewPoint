import { useState, useEffect } from 'react';
import { Heart } from 'react-feather';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const ReplyLike = ({ like, replyId }: { like: string[], replyId: string }) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const pathname = usePathname()
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(like);

  useEffect(() => {
    if (session && session.user) {
      if(likes.includes(session.user._id.toString())){
        setLiked(true)
      }
    }
  }, [session, likes]);

  const handleClick = async () => {
    if (!session || !session.user) {
      router.push(`/sign-in?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const userId = session.user._id;

    // Update local liked state and likedResponses in session
    if (liked) {
        setLikes(likes.filter(id=>id!=userId))
        console.log(likes)
      } else {
        setLikes([...likes , userId]);
      }
  
      setLiked(!liked);

    try {
      const response = await axios.post('/api/likesHandle/replyLikes', { userId, replyId });

      // Update session to reflect changes
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

export default ReplyLike;
