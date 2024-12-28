import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Trash2, Save, FileIcon as FileUserIcon, FolderOpen } from 'lucide-react';
import { useResumeContext } from '../context/ResumeContext';
import { fetchUserTemplatesBasedOnUserID } from '@/firebase/firebaseSetup';
import { useUser } from '@clerk/nextjs';
import { useToast } from "@/hooks/use-toast"

// Define the type for templates
interface Template {
  id: string;
  name: string;
  data?: any;
}

interface ResumeManagerProps {
  templates: Array<{
    id: string;
    name: string;
    data: any;
  }>;
  onSaveTemplate: (name: string, data: any) => void;
}

const ResumeManager: React.FC<ResumeManagerProps> = ({ templates, onSaveTemplate }) => {
  const [newTemplateName, setNewTemplateName] = useState('');
  const { resumeData, updateResumeData } = useResumeContext();
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const { user, isSignedIn, isLoaded } = useUser();
  const { toast } = useToast()

  const handleSaveTemplate = async (name: string, data: any) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive"
      });
      return;
    }

    try {
      const templateId = crypto.randomUUID();
      const response = await fetch("/api/save-templates", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          templateName: name,
          templateData: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Save Failed",
          description: errorData.error || "Could not save template",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const newTemplate = { id: templateId, name, data };
      setUserTemplates(prev => [...prev, newTemplate]);
      
      // Reset input and show success toast
      setNewTemplateName('');
      toast({
        title: "Template Saved",
        description: `"${name}" has been saved successfully`,
      });

      onSaveTemplate(name, data);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch("/api/delete-template", {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        toast({
          title: "Delete Failed",
          description: "Could not delete template",
          variant: "destructive"
        });
        return;
      }

      // Remove template from local state
      setUserTemplates(prev => prev.filter(template => template.id !== templateId));
      
      toast({
        title: "Template Deleted",
        description: "Template was successfully removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const fetchedTemplates = await fetchUserTemplatesBasedOnUserID(user.id);
        setUserTemplates(fetchedTemplates);
      } catch (error) {
        toast({
          title: "Fetch Failed",
          description: "Could not fetch templates",
          variant: "destructive"
        });
      }
    };

    fetchTemplates(); 
  }, [isLoaded, isSignedIn, user]);

  const handleLoad = (template: Template) => {
    updateResumeData(template.data);
    toast({
      title: "Template Loaded",
      description: `"${template.name}" has been loaded`,
    });
  };

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-600/20 hover:bg-blue-600/30 hover:text-white text-blue-400 border border-blue-400/30">
                <FileUserIcon className="mr-2 h-4 w-4" />
                Save your Resumes
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            Save, load, and manage your resume templates
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[480px] bg-[#1a2644] text-white border-blue-900/30">
          <DialogHeader>
            <DialogTitle>Resume Template Manager</DialogTitle>
          </DialogHeader>

          <Card className="bg-black/20 border-none text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Templates</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isDeleteMode ? "destructive" : "ghost"} 
                      size="sm"
                      onClick={() => setIsDeleteMode(!isDeleteMode)}
                      className={isDeleteMode ? "bg-red-600/20 hover:bg-red-600/30 text-red-400" : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"}
                    >
                      {isDeleteMode ? "Cancel" : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isDeleteMode ? "Exit Delete Mode" : "Delete Templates"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New resume template name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="flex-grow bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Button 
                  onClick={() => handleSaveTemplate(newTemplateName, resumeData)}
                  disabled={!newTemplateName.trim()}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30"
                >
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>

              <ScrollArea className="h-64 w-full rounded-md border border-blue-900/30">
                {userTemplates.length > 0 ? (
                  userTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className="flex items-center justify-between p-2 hover:bg-[#0f1833]/50"
                    >
                      <span>{template.name}</span>
                      <div className="flex items-center space-x-2">
                        {isDeleteMode ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLoad(template)}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                          >
                            <FolderOpen className="mr-2 h-4 w-4" /> Load
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    No resume templates available
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ResumeManager;

