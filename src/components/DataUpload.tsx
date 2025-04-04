import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

import { collectionBucket, collectionEndpoint } from '@/data/api';

export function DataUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelection(file);
  };

  const handleFileSelection = async (file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);

    console.log("Getting request for " + file.name);
    console.log(file.type);
    console.log(collectionBucket);
    console.log(collectionEndpoint);
    const xhr = new XMLHttpRequest();
    const urlWithParams = collectionEndpoint + "?file=" + file.name + "&bucket=" + collectionBucket;
    xhr.open('GET', urlWithParams);
    xhr.onload = function() {
      const res = JSON.parse(xhr.response);
      console.log(res["URL"]);
      if (xhr.status === 200) {
        if (res["URL"]) {
          const xhr2 = new XMLHttpRequest();
          xhr2.open('PUT', res["URL"]);
          xhr2.setRequestHeader("Content-Type", "text/csv");
          xhr2.onreadystatechange = function () {
            if (xhr2.status === 200) {
              setUploadProgress(100);
              clearInterval(uploadInterval);
              toast({
                title: 'Upload Complete',
                description: `Successfully uploaded ${file.name}`,
              });
            }
          };
          const reader = new FileReader();
          reader.onload = function(event) {
            if (event.target && event.target.result) {
              const blob = new Blob([event.target.result as ArrayBuffer], { type: "text/csv" });
              xhr2.send(blob);
            } else {
              console.log("Error reading the file.");
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          console.log()
          console.log("Error with url");
        }
      } else {
        console.log("Error:", res);
      }
    }
    xhr.send();

    // Simulate file upload with progress
    const totalSize = file.size;
    let uploadedSize = 0;
    const chunkSize = totalSize / 100;

    const uploadInterval = setInterval(() => {
      uploadedSize += chunkSize;
      const progress = Math.min((uploadedSize / totalSize) * 100, 100);
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(uploadInterval);
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${file.name}`,
        });
      }
    }, 50);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Upload</CardTitle>
        <CardDescription>
          Upload your data files. Supported format: CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-7rem)]">
        <motion.div
          className={`relative h-full border-2 border-dashed rounded-lg p-8 flex items-center justify-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
          }}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileInput}
            accept=".csv,.json,.xlsx,.xls"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-16 w-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium">
                  Drag and drop your file here, or{' '}
                  <label
                    htmlFor="file-upload"
                    className="text-primary cursor-pointer hover:underline"
                  >
                    browse
                  </label>
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 10GB</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xl space-y-6">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Upload className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-center text-sm text-gray-500">
                {uploadProgress < 100
                  ? `Uploading... ${Math.round(uploadProgress)}%`
                  : 'Upload complete!'}
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}