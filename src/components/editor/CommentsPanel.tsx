
import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  User, 
  Send, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: number; // timestamp
}

interface CommentsData {
  [pageId: string]: Comment[];
}

export interface CommentsPanelProps {
  pageId: string;
  onClose: () => void;
}

export function CommentsPanel({ pageId, onClose }: CommentsPanelProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const userName = "Joselyn Monge"; // Default user name
  
  // Use LocalStorage to persist comments
  const [savedComments, setSavedComments] = useLocalStorage<CommentsData>("notion-comments", {});

  // Load comments when panel opens
  useEffect(() => {
    if (savedComments[pageId]) {
      setComments(savedComments[pageId]);
    }
  }, [pageId, savedComments]);

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: userName,
      createdAt: Date.now(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    
    // Save to localStorage
    setSavedComments({
      ...savedComments,
      [pageId]: updatedComments
    });
    
    setNewComment("");
  };

  const formatCommentDate = (timestamp: number) => {
    return format(timestamp, "d MMM 'a las' HH:mm", { locale: es });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-20 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-700" />
          <h3 className="font-medium">Comentarios</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No hay comentarios aún</p>
            <p className="text-sm">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-xs text-gray-500">{formatCommentDate(comment.createdAt)}</p>
                </div>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <Textarea
            placeholder="Añade un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[60px] resize-none"
          />
          <Button 
            onClick={addComment}
            className="mt-1"
            size="sm"
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
