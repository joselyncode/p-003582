
import React, { useState } from "react";
import { TextBlock } from "./blocks/TextBlock";
import { BlockMenu } from "./BlockMenu";
import { Plus } from "lucide-react";

type BlockType = "text" | "heading1" | "heading2" | "heading3" | "todo" | "bullet" | "numbered";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export function PageEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "heading1", content: "Mi página de notas" },
    { id: "2", type: "text", content: "Esta es una aplicación tipo Notion minimalista centrada en productividad y escritura colaborativa." },
    { id: "3", type: "text", content: "Puedes añadir nuevos bloques de contenido haciendo clic en el botón + que aparece al pasar el ratón entre bloques." },
  ]);
  
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showMenuAtIndex, setShowMenuAtIndex] = useState<number | null>(null);

  const handleBlockChange = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const handleBlockFocus = (id: string) => {
    setFocusedBlockId(id);
  };

  const handleBlockBlur = () => {
    setFocusedBlockId(null);
  };

  const addBlock = (index: number, type: BlockType = "text") => {
    const newId = Date.now().toString();
    setBlocks([
      ...blocks.slice(0, index + 1),
      { id: newId, type, content: "" },
      ...blocks.slice(index + 1)
    ]);
    setShowMenuAtIndex(null);
  };

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, type: newType } : block
    ));
    setShowMenuAtIndex(null);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  return (
    <div className="mb-20">
      {blocks.map((block, index) => (
        <div key={block.id} className="relative group">
          <TextBlock 
            block={block}
            onChange={(content) => handleBlockChange(block.id, content)}
            onFocus={() => handleBlockFocus(block.id)}
            onBlur={handleBlockBlur}
            onDelete={() => deleteBlock(block.id)}
            changeType={(type) => changeBlockType(block.id, type)}
          />
          
          {/* Add button between blocks */}
          <div 
            className="absolute left-0 -ml-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button 
              onClick={() => setShowMenuAtIndex(index)} 
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {showMenuAtIndex === index && (
            <BlockMenu 
              onSelect={(type) => addBlock(index, type)} 
              onClose={() => setShowMenuAtIndex(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
