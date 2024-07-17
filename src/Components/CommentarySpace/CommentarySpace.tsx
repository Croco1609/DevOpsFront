import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import "./CommentarySpace.css";
import useAuth from '../../hooks/useAuth';
import axios from "axios";
import getApiUrl from '../../Services/getApiUrl';
import { BsPencil, BsReply, BsSave, BsTrash } from 'react-icons/bs';


interface CommentProps {
  comment: {
    author: {
      pseudo: string;
    };
    id: string;
    parentId: string | null;
    content: string;
  };
  children?: ReactNode;
  onNewComment: (newComment: any) => void;
  ressId: any;
  onCommentDelete: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, children, onNewComment, ressId, onCommentDelete }) => {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const [replyDescription, setReplyDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const serializeJsonLd = (data: any) => {
    return JSON.stringify({
      "@context": "/api/contexts/User",
      "@type": "User",
      ...data,
    });
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!replyDescription) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const ressourceId = "/api/ressources/" + ressId;
    const parentCommentId = "/api/comments/" + parentId;

    try {
      const response = await axios.post(
        getApiUrl("/comments"),
        serializeJsonLd({ content: replyDescription, ressource: ressourceId, parent: parentCommentId }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/ld+json'
          },
        }
      );

      console.log("Commentaire créé avec succès :", response.data);
      setSuccessMessage("Le commentaire a été créé avec succès !");
      setError('');
      setReplyDescription('');

      onNewComment(response.data);

    } catch (error) {
      console.error("Erreur lors de la création du commentaire :", error);
      setError("Erreur lors de la création du commentaire.");
      setSuccessMessage('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
      try {
        await axios.delete(getApiUrl(`/comments/${comment.id}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onCommentDelete(comment.id);
      } catch (error) {
        setError("Erreur lors de la suppression du commentaire.");
      }
    }
  };

  const handleEdit = async () => {
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.patch(
        getApiUrl(`/comments/${comment.id}`),
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/merge-patch+json'
          },
        }
      );

      console.log("Commentaire modifié avec succès :", response.data);

      setSuccessMessage("Le commentaire a été modifié avec succès !");
      setError('');
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire :", error);
      setError("Erreur lors de la modification du commentaire.");
      setSuccessMessage('');
    }
  };

  return (
    <div className={`comment ${comment.parentId ? 'reply' : ''}`} style={{ marginLeft: comment.parentId ? '20px' : '' }}>
      <div className="commentUser">
      <div className="avatar" style={{ backgroundImage: 'url(/img/profile.jpg)' }}></div>
        <p className="username">{comment.author.pseudo}</p>
      </div>
      <div className="content">
        {editMode ? (
          <textarea
          className='commentSpace'
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder={t('comment.edit')}
          />
        ) : (
          <p className="text">{comment.content}</p>
        )}
      </div>
      {isAuthenticated && !comment.parentId && (
        <form onSubmit={(e) => handleReply(e, comment.id)}>
          {!editMode && (
            <>
              <textarea
              className='commentSpace'
                value={replyDescription}
                onChange={(e) => setReplyDescription(e.target.value)}
                placeholder={t('comment.reply')}
              />
              <button type="submit" aria-label={t('comment.reply')}>
                <BsReply />
              </button>
              <div className='buttonComments'>
        {isAuthenticated && (
          <>
            {editMode ? (
              <button onClick={handleSaveEdit}><BsSave /></button>
            ) : (
              <>
                <button onClick={handleEdit}>
                  <BsPencil />
                </button>
                <button onClick={handleDelete}>
                  <BsTrash />
                </button>
              </>
            )}
          </>
        )}
        {successMessage && <p className="successMessage">{successMessage}</p>}
        {error && <p className="errorMessage">{error}</p>}
        

      </div>
      
            </>
          )}
        </form>
        
      )}
      {children}

    </div>
  );
};

interface CommentListProps {
  comments: {
    author: {
      pseudo: string;
    };
    id: string;
    parentId: string | null;
    content: string;
  }[];
  onNewComment: (newComment: any) => void;
  ressId: string;
  onCommentDelete: (commentId: string) => void;
  onCommentEdit: (commentId: string, newContent: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onNewComment, ressId, onCommentDelete }) => {
  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <Comment key={comment.id} comment={comment} onNewComment={onNewComment} ressId={ressId} onCommentDelete={onCommentDelete}>
          {renderComments(comment.id)}
        </Comment>
      ));
  };

  return <>{renderComments()}</>;
};

interface CommentarySpaceProps {
  comments: {
    author: {
      pseudo: string;
    };
    id: string;
    parentId: string | null;
    content: string;
  }[];
  userId: string;
  ressourceId: string;
}

const CommentarySpace: React.FC<CommentarySpaceProps> = ({ comments: initialComments, userId, ressourceId }) => {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [parentDescription, setParentDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const serializeJsonLd = (data: any) => {
    return JSON.stringify({
      "@context": "/api/contexts/User",
      "@type": "User",
      ...data,
    });
  };

  const handleParentComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentDescription) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const ressourceIdPath = "/api/ressources/" + ressourceId;

    try {
      const response = await axios.post(
        getApiUrl("/comments"),
        serializeJsonLd({ content: parentDescription, ressource: ressourceIdPath }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/ld+json'
          },
        }
      );

      console.log("Commentaire créé avec succès :", response.data);
      setSuccessMessage("Le commentaire a été créé avec succès !");
      setError('');
      setParentDescription('');

      setComments(prevComments => [...prevComments, response.data]);

    } catch (error) {
      console.error("Erreur lors de la création du commentaire :", error);
      setError("Erreur lors de la création du commentaire.");
      setSuccessMessage('');
    }
  };

  const handleNewComment = (newComment: any) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleCommentDelete = (commentId: string) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

  const handleCommentEdit = (commentId: string, newContent: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    );
  };

  return (
    <div className="commentarySpace">
      <h2 className="commentaryTitle">{t("comment.title")}</h2>
      {isAuthenticated ? (
        <form onSubmit={handleParentComment} className="parentForm">
          <div className="formGroup">
            <label htmlFor="parentDescription">{t('comment.commentbody')}:</label>
            <textarea
              className='commentSpace'
              id="parentDescription"
              name="parentDescription"
              required
              value={parentDescription}
              onChange={(e) => setParentDescription(e.target.value)}
            />
          </div>
          <button type="submit">{t('comment.submit')}</button>
        </form>
      ) : (
        <p>{t("commentarySpace.log")}</p>
      )}
      {successMessage && <p className="successMessage">{successMessage}</p>}
      {error && <p className="errorMessage">{error}</p>}
      <CommentList
        comments={comments}
        onNewComment={handleNewComment}
        ressId={ressourceId}
        onCommentDelete={handleCommentDelete}
        onCommentEdit={handleCommentEdit} // Ajout de la fonction de modification
      />
    </div>
  );
};

export default CommentarySpace;
