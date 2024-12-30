import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Copy, Check } from 'lucide-react'

interface AiCheckerInterface {
  data: string | string[];
  format: 'points' | 'paras';
  sectionType: string;
  onApply: (content: string | string[]) => void;
}

function AiChecker({ 
  data: initialData = '', 
  format: initialFormat = 'points', 
  sectionType: initialSectionType = '',
  onApply
}: AiCheckerInterface) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState(initialData);
  const [format, setFormat] = useState<'points' | 'paras'>(initialFormat);
  const [sectionType, setSectionType] = useState(initialSectionType);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
    setGeneratedContent('');
    setIsGenerating(false);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleFormatChange = (value: 'points' | 'paras') => {
    setFormat(value);
  };

  const handleSectionTypeChange = (value: string) => {
    setSectionType(value);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleApplyContent = () => {
    if (format === 'points') {
      const points = generatedContent
        .split('\n')
        .map(point => point.trim())
        .filter(point => point !== '');
      onApply(points);
    } else {
      onApply(generatedContent);
    }
    setIsOpen(false);
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      // Convert input to string if it's an array
      const inputString = Array.isArray(userInput) ? userInput.join('\n') : String(userInput);
      const numPoints = inputString.split('\n').filter(line => line.trim() !== '').length;
      
      const response = await fetch('/api/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: inputString,
          format,
          sectionType,
          numPoints
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedContent(data.response);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('There was an error generating content.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <Button onClick={handleOpenDialog}>
        AI Checker <Sparkles className="text-yellow-200" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Checker</DialogTitle>
            <DialogDescription>
              Provide some content and select a format, then let the AI generate a better version for you.
            </DialogDescription>
          </DialogHeader>

          {!generatedContent ? (
            <>
              <div className="mb-4">
                <label htmlFor="section-type" className="block text-sm font-medium text-gray-700">
                  Select Section Type
                </label>
                <Select value={sectionType} onValueChange={handleSectionTypeChange}>
                  <SelectTrigger id="section-type">
                    <SelectValue placeholder="Select Section Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="skills">Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Select Format
                </label>
                <Select value={format} onValueChange={handleFormatChange}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Bullet Points</SelectItem>
                    <SelectItem value="paras">Paragraphs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                value={Array.isArray(userInput) ? userInput.join('\n') : userInput}
                onChange={handleInputChange}
                placeholder="Enter your content here..."
                rows={5}
              />

              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </Button>
            </>
          ) : (
            <>
              <Textarea value={generatedContent} rows={10} readOnly />
              <div className="flex justify-between mt-4">
                <Button onClick={handleCopyContent} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={handleApplyContent} variant="default">
                  <Check className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
              <Button onClick={() => setGeneratedContent('')} variant="outline" className="mt-2 w-full">
                Generate Again
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AiChecker;

