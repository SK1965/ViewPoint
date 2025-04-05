import { useState, useEffect, useRef } from 'react';
import { Share2Icon, CopyIcon, X } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import { toast } from 'sonner';

const Share = ({ queryId }: { queryId: string }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  // URL to be shared - replace with your actual URL
  const shareUrl = `${window.location.origin}/post/${queryId}`; // Use window.location.origin to ensure correct URL
  const title = 'Check out this awesome content!';

  // Toggle the popup visibility
  const handleClick = () => setShowPopup(true);
  
  // Close the popup and reset copied state
  const closePopup = () => {
    setShowPopup(false);
    setCopied(false);
  };
  
  // Copy the share URL to clipboard
  const copyToClipboard = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.error("Clipboard API is not available in this environment.");
      // Optionally, display a message or fallback behavior
      toast('Clipboard is not available in this environment.');
    }
  };
  
  
  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };
    
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);
  
  // Close popup on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };
    
    if (showPopup) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showPopup]);
  
  return (
    <div className="flex flex-col items-center relative">
      <button 
        className="flex flex-col items-center hover:opacity-80 transition-opacity focus:outline-none"
        onClick={handleClick}
        aria-label="Share content"
      >
        <Share2Icon className="cursor-pointer" />
        <span className="text-accent-foreground text-sm">Share</span>
      </button>
      
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={popupRef}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg dark:text-white">Share</h3>
              <button 
                onClick={closePopup}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close share dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Share this link</p>
              <div className="flex">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1 border rounded-l-md py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <button 
                  onClick={copyToClipboard}
                  className={`${
                    copied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-r-md px-4 flex items-center transition-colors`}
                >
                  <CopyIcon className="h-4 w-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Share on social media</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <FacebookShareButton url={shareUrl} hashtag="#AwesomeContent">
                  <FacebookIcon size={48} round />
                </FacebookShareButton>
                
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={48} round />
                </TwitterShareButton>
                
                <LinkedinShareButton url={shareUrl} title={title}>
                  <LinkedinIcon size={48} round />
                </LinkedinShareButton>
                
                <WhatsappShareButton url={shareUrl} title={title}>
                  <WhatsappIcon size={48} round />
                </WhatsappShareButton>
                
                <EmailShareButton url={shareUrl} subject={title}>
                  <EmailIcon size={48} round />
                </EmailShareButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
