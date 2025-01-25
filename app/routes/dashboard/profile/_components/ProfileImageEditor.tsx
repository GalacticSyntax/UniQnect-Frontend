import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Upload, X, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";

const ProfileImageEditor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-h-[90vh] max-w-xl overflow-hidden overflow-y-auto">
        <ScrollArea className="w-full h-full">
          <DialogHeader className="pb-5">
            <DialogTitle className="text-center">
              Uplaod Profile Image
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <section>
            <Card className="max-w-md mx-auto border-none">
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!preview ? (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <p className="text-gray-500">
                        Drag and drop an image here, or click to select one
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profileUploader"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="profileUploader"
                        className="mt-2 px-4 py-1.5 rounded-md cursor-pointer bg-primary text-primary-foreground hover:opacity-80"
                      >
                        Browse
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Uploaded Preview"
                        className="rounded-lg object-cover max-h-64 w-full"
                      />
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                  )}
                </div>
                {image && (
                  <p className="text-center mt-4 text-sm text-gray-500">
                    {image.name} ({(image.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageEditor;
