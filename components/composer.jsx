"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Paperclip, 
  Smile, 
  Send, 
  Bold, 
  Italic, 
  Code, 
  Link2, 
  List,
  AtSign,
  Hash
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const emojis = ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🎉", "🎊", "🎈", "🎁", "🎀", "🏆", "🥇", "🥈", "🥉", "🏅", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🏋️", "🤼", "🤸", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚴", "🚵", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩", "🚀", "🛸", "🛰️", "⭐", "🌟", "✨", "⚡", "☄️", "💥", "🔥", "🌈", "☀️", "🌤️", "⛅", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "💧", "💦", "☔", "☂️", "🌊", "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣", "🥡", "🥢", "🧂"]

export function Composer({ 
  value = "", 
  onChange = () => {}, 
  placeholder = "Type a message...",
  onSubmit = () => {},
  size = "default"
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSubmit(e)
      }
    }
  }

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + emoji + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    }
    setShowEmojiPicker(false)
  }

  const formatText = (format) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      let formattedText = selectedText

      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
        case 'code':
          formattedText = `\`${selectedText}\``
          break
        case 'link':
          formattedText = `[${selectedText}](url)`
          break
        case 'list':
          formattedText = `• ${selectedText}`
          break
        default:
          break
      }

      const newValue = value.substring(0, start) + formattedText + value.substring(end)
      onChange(newValue)
      textarea.focus()
    }
  }

  const isSmall = size === "sm"

  return (
    <div className={`relative ${isSmall ? '' : 'space-y-2'}`}>
      {/* Formatting Toolbar */}
      {!isSmall && showFormatting && (
        <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg animate-in">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => formatText('bold')}
                >
                  <Bold className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => formatText('italic')}
                >
                  <Italic className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => formatText('code')}
                >
                  <Code className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => formatText('link')}
                >
                  <Link2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => formatText('list')}
                >
                  <List className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="h-4 w-px bg-border mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => insertEmoji('@')}
                >
                  <AtSign className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mention</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => insertEmoji('#')}
                >
                  <Hash className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Channel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Main Composer */}
      <div className={`
        flex items-end gap-2 p-2 rounded-lg border border-border 
        bg-background focus-within:ring-2 focus-within:ring-primary/20
        ${isSmall ? '' : 'min-h-[80px]'}
      `}>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 resize-none border-0 bg-transparent p-2 
            focus-visible:ring-0 focus-visible:ring-offset-0
            ${isSmall ? 'min-h-[40px] max-h-[100px]' : 'min-h-[60px] max-h-[200px]'}
          `}
          rows={isSmall ? 1 : 2}
        />

        <div className="flex items-center gap-1">
          {!isSmall && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowFormatting(!showFormatting)}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Formatting</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={isSmall ? "h-7 w-7" : "h-8 w-8"}
              >
                <Smile className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="end">
              <div className="grid grid-cols-10 gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="p-1 hover:bg-muted rounded text-lg transition-colors"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            size={isSmall ? "sm" : "default"}
            className="gradient-brand hover-lift"
            disabled={!value.trim()}
            onClick={onSubmit}
          >
            <Send className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
        </div>
      </div>

      {/* Character Count */}
      {!isSmall && value.length > 0 && (
        <div className="text-xs text-muted-foreground text-right">
          {value.length} / 4000 characters
        </div>
      )}
    </div>
  )
}
