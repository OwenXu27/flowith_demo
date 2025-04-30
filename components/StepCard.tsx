'use client';

import { Step } from '../types/Step';
import { Play, Pause, Loader2, CheckCircle2, Pencil, Check, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface SubTaskCardProps {
  content: string;
  onUpdate: (newContent: string) => void;
  onDelete: () => void;
  onEditStart: () => void;
}

const SubTaskCard = ({ content, onUpdate, onDelete, onEditStart }: SubTaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const textRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setHasOverflow(element.scrollHeight > 30);
    }
  }, [content]);

  const handleSave = () => {
    onUpdate(editedContent);
    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedContent(content);
      setIsEditing(false);
      setIsExpanded(false);
    }
  };

  const handleTextClick = () => {
    if (hasOverflow && !isExpanded) {
      setIsExpanded(true);
    } else {
      setIsEditing(true);
      onEditStart();
    }
  };

  return (
    <div className="bg-[#F0EEEC] p-3 rounded-2xl border border-[#BEBEBE26] shadow-[inset_0px_0px_4px_2px_rgba(0,0,0,0.09)]">
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-[13px] leading-[15.6px] tracking-[0.00em] text-[#0000008C] resize-none"
            style={{ height: 'auto', minHeight: '30px' }}
          />
        ) : (
          <div className="flex-1">
            <div 
              ref={textRef}
              onClick={handleTextClick}
              className={`text-[13px] leading-[15.6px] tracking-[0.00em] text-[#0000008C] cursor-pointer ${
                hasOverflow && !isExpanded ? 'line-clamp-2' : ''
              }`}
              style={{ height: hasOverflow && !isExpanded ? '30px' : 'auto' }}
            >
              {content}
            </div>
          </div>
        )}
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: Step;
  isActive: boolean;
  onUpdate: (updatedStep: Step) => void;
  onEditStart: () => void;
}

const StepCard = ({ step, isActive, onUpdate, onEditStart }: StepCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(step.title);
  const [items, setItems] = useState(step.items);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.setSelectionRange(
        titleRef.current.value.length,
        titleRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      onEditStart();
    }
  };

  const handleTitleBlur = () => {
    if (title.trim() !== step.title) {
      onUpdate({ ...step, title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleItemUpdate = (index: number, updatedItem: string) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    onUpdate({ ...step, items: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...items, ''];
    setItems(newItems);
    onUpdate({ ...step, items: newItems });
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate({ ...step, items: newItems });
  };

  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#E5E5E5]" />;
      case 'running':
        return isActive ? (
          <Loader2 className="w-5 h-5 text-[#8A2BE2] animate-spin" />
        ) : (
          <Circle className="w-5 h-5 text-[#8A2BE2]" />
        );
      default:
        return <Circle className="w-5 h-5 text-[#E5E5E5]" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border ${
      step.status === 'running' && isActive 
        ? 'border-[#8A2BE2] animate-[pulse_2s_ease-in-out_infinite]' 
        : 'border-[#E5E5E5]'
    } overflow-hidden`}>
      <div className="flex items-center gap-3 p-4">
        {getStatusIcon()}
        <div className="flex-1">
          {isEditing ? (
            <textarea
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className="w-full text-[16px] font-normal text-[#0A0A0A] leading-[19.2px] tracking-[0.00em] resize-none focus:outline-none"
              rows={1}
            />
          ) : (
            <div 
              className="text-[16px] font-normal text-[#0A0A0A] leading-[19.2px] tracking-[0.00em] cursor-pointer"
              onClick={handleTitleClick}
            >
              {title}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-[#E5E5E5] space-y-3">
        {items.map((item, index) => (
          <SubTaskCard
            key={index}
            content={item}
            onUpdate={(updatedContent) => handleItemUpdate(index, updatedContent)}
            onDelete={() => handleDeleteItem(index)}
            onEditStart={onEditStart}
          />
        ))}
        <button
          onClick={handleAddItem}
          className="w-full py-2 text-[14px] font-normal text-[#0A0A0A] leading-[16.8px] tracking-[0.00em] hover:bg-[#F5F5F5] rounded-md transition-colors"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};

export default StepCard; 