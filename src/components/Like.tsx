import { useState } from 'react';
import { Button } from './ui/button';
import { Heart } from 'react-feather'; // Or use any other icon library

const Like = ({ count }: { count: number }) => {
  const [liked, setLiked] = useState(false);
  const [likes ,setLikes] = useState(count)
  // Toggle like/unlike state
  const handleClick = () => {
    if(liked){
        setLikes(likes - 1)
    }else{
        setLikes(likes + 1)
    }
    setLiked(prevState => !prevState);
    
  };

  return (
    <div className='flex-col text-center items-center justify-center'>
    <Heart className={`w-8 h-8 ${liked ? "fill-red-600 text-red-500" : "" }`} onClick={handleClick} />
    {/* Like count below the Heart Icon */}
    <span className=""> {likes}</span>
    </div>
   
  );
};

export default Like;
