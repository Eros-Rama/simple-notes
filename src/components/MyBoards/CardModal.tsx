"use client";

import { ICard, ICardComments } from "@/types/card-interface";
import React, { useEffect, useState } from "react";
import {
  AiFillDelete,
  AiOutlineClose,
  AiOutlineCreditCard,
} from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { LiaCommentSolid } from "react-icons/lia";
import CardComment from "@/components/MyBoards/CardComment";

interface CardModalProps {
  card: ICard;
  listTitle: string;
  isOpen: boolean;
  onDeleteCard: (card: ICard) => void;
  onUpdateCardDetails: (card: ICard) => void;
  closeModal: () => void;
}

function CardModal(props: CardModalProps) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<ICardComments[]>([]);
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [sureDelete, setSureDelete] = useState<boolean>(false);

  useEffect(() => {
    if (props.card) {
      setCardTitle(props.card.cardTitle!);
      setCardDescription(props.card.cardDescription!);
      setEditDescription(props.card.cardDescription!.length === 0);

      if (props.card.comments && props.card.comments.length > 0) {
        setComments(props.card.comments);
      }
    }
  }, [props.card]);

  const onSaveDescription = () => {
    if (cardDescription.trim().length === 0) return;
    if (cardDescription === props.card.cardDescription) {
      setEditDescription(false);
      return;
    }

    let updatedCard;
    if (
      cardTitle.trim().length > 0 &&
      cardTitle !== props.card.cardDescription
    ) {
      updatedCard = { ...props.card, cardTitle, cardDescription };
    } else {
      updatedCard = { ...props.card, cardTitle };
    }

    props.onUpdateCardDetails(updatedCard);
    setEditDescription(false);
  };

  const onUpdateTitle = () => {
    if (cardTitle.trim().length === 0) {
      setCardTitle(props.card.cardTitle!);
      return;
    }
    if (cardTitle === props.card.cardTitle) return;

    let updatedCard;
    if (
      cardDescription.trim().length > 0 &&
      cardDescription !== props.card.cardDescription &&
      !editDescription
    ) {
      updatedCard = { ...props.card, cardTitle, cardDescription };
    } else {
      updatedCard = { ...props.card, cardTitle };
    }

    props.onUpdateCardDetails(updatedCard);
  };

  const onAddComment = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (newComment.trim() !== "") {
        const newCommentObj: ICardComments = {
          id: Date.now(),
          comment: newComment.trim(),
          editedOn: new Date(),
        };

        // Save the comment locally
        const updatedCommentArray = [...comments];
        updatedCommentArray.unshift(newCommentObj);
        setComments(updatedCommentArray);
        setNewComment("");

        // send the comment for db update
        let updatedCard;
        if (
          cardDescription.trim().length > 0 &&
          cardDescription !== props.card.cardDescription &&
          !editDescription
        ) {
          updatedCard = {
            ...props.card,
            comments: updatedCommentArray,
            cardDescription,
          };
        } else {
          updatedCard = { ...props.card, comments: updatedCommentArray };
        }

        props.onUpdateCardDetails(updatedCard);
      }
    }
  };

  const onDeleteComment = (commentId: number) => {
    const updatedComments = [...comments];
    const comment = updatedComments.find((comment) => comment.id === commentId);

    if (comment) {
      updatedComments.splice(updatedComments.indexOf(comment), 1);
      setComments(updatedComments);

      // send for db update
      let updatedCard;
      if (
        cardDescription.trim().length > 0 &&
        cardDescription !== props.card.cardDescription &&
        !editDescription
      ) {
        updatedCard = {
          ...props.card,
          comments: updatedComments,
          cardDescription,
        };
      } else {
        updatedCard = { ...props.card, comments: updatedComments };
      }

      props.onUpdateCardDetails(updatedCard);
    }
  };

  const onClose = () => {
    setCardTitle("");
    setCardDescription("");
    setNewComment("");
    setEditDescription(false);
    setSureDelete(false);
    props.closeModal();
  };

  return (
    props.card !== null && (
      <div
        className={`fixed inset-0 ${
          props.isOpen ? "flex" : "hidden"
        } items-center justify-center bg-slate-900 bg-opacity-80`}
      >
        <div className="bg-white dark:bg-slate-800 w-full sm:w-5/6 md:w-2/3 lg:w-1/2 p-4 rounded-lg shadow-md transform transition-transform ease-in-out duration-300 max-h-[80vh]">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            onClick={onClose}
          >
            <AiOutlineClose className="w-6 h-6" title="Close" />
          </button>

          <span className="flex flex-col w-[90%] gap-1 mb-2 text-black dark:text-white">
            {/* Title Section */}
            <span className="flex w-full justify-start items-center gap-2">
              <AiOutlineCreditCard className="w-6 h-6" />
              <input
                className="w-[90%] text-xl font-semibold bg-white dark:bg-slate-800 text-black dark:text-white"
                maxLength={34}
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                onBlur={onUpdateTitle}
              />
            </span>
            <h5 className="text-sm ml-8">
              in list <b>{props.listTitle}</b>
            </h5>
          </span>

          <span className="flex flex-col w-full max-h-[65vh] overflow-y-auto scrollbar-none gap-2 dark:text-white">
            {/* Description */}
            <span className="flex w-full justify-start items-center gap-2 mt-6">
              <CgDetailsMore className="w-6 h-6" />
              <h2 className="font-semibold">Description</h2>
            </span>
            {editDescription && (
              <span className="flex flex-col w-full">
                <textarea
                  rows={4}
                  maxLength={300}
                  className="w-[90%] border border-blue-500 p-2 outline-none resize-none ml-8 rounded-md dark:bg-gray-600 text-base"
                  placeholder="Write a meaningful description"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                />
                <span className="flex w-[90%] justify-between ml-8">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white mt-1 px-3 py-1 rounded-md w-fit"
                    onClick={onSaveDescription}
                  >
                    Save
                  </button>
                  <p className="text-xs italic">{cardDescription.length}/300</p>
                </span>
              </span>
            )}
            {!editDescription && (
              <p
                className="ml-8 w-[90%] text-black text-base dark:text-white cursor-pointer"
                onClick={() => setEditDescription(true)}
              >
                {cardDescription}
              </p>
            )}

            <span className="flex w-full justify-start items-center gap-2 mt-6">
              <LiaCommentSolid className="w-6 h-6" />
              <h2 className="font-semibold">Comments</h2>
            </span>
            {/* Add Comments Section */}
            <div className="flex w-full">
              <textarea
                rows={2}
                maxLength={300}
                className="w-[90%] border border-blue-500 p-2 outline-none resize-none ml-8 rounded-md dark:bg-gray-600 text-sm"
                placeholder="Add a comment, then press enter to save..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={onAddComment}
              />
            </div>

            {/* Show Comments Section */}
            {comments.length > 0 && (
              <div className="w-[90%] ml-8 flex flex-col gap-3 rounded-md">
                {comments.map((comment) => {
                  return (
                    <CardComment
                      key={comment.id}
                      comment={comment}
                      onDelete={onDeleteComment}
                    />
                  );
                })}
              </div>
            )}

            {/* Delete Card Button */}
            {!sureDelete && (
              <button
                className="bg-red-500 text-white px-3 py-2 w-fit rounded-md mt-6 ml-8 hover:bg-red-700 flex justify-center items-center gap-2"
                onClick={() => setSureDelete(true)}
              >
                Delete Card
                <AiFillDelete className="w-5 h-5" />
              </button>
            )}
            {sureDelete && (
              <span className="ml-8 flex justify-start items-center gap-2 mt-6">
                <button
                  className="bg-slate-300 hover:bg-slate-400 text-black p-2 w-fit rounded-md"
                  onClick={() => setSureDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 w-fit rounded-md"
                  onClick={() => {
                    props.onDeleteCard(props.card);
                    onClose();
                  }}
                >
                  Confirm Delete
                </button>
              </span>
            )}
          </span>
        </div>
      </div>
    )
  );
}

export default CardModal;
