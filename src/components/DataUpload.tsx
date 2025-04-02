import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCognito } from '@/hooks/useCognito';
import { collectionEndpoint } from '@/data/api';

export function DataUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user, login, logout } = useCognito();

  if (!user) {
    return (
      <div className="text-center p-6">
        <p>You need to be logged in to upload data.</p>
        <Button onClick={login} className="bg-green-500 text-white mt-4">
          Login
        </Button>
      </div>
    );
  }

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

    console.log("Uploading file: " + file.name);
    const xhr = new XMLHttpRequest();
    const urlWithParams = `${collectionEndpoint}?file=${file.name}`;
    xhr.setRequestHeader("Authorization", `Bearer ${user.token}`);
    xhr.open('GET', urlWithParams);
    xhr.onload = function() {
      const res = JSON.parse(xhr.response);
      if (xhr.status === 200 && res["URL"]) {
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
          if (event.target?.result) {
            const blob = new Blob([event.target.result as ArrayBuffer], { type: "text/csv" });
            xhr2.send(blob);
          } else {
            console.log("Error reading the file.");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.log("Error with upload URL");
      }
    };
    xhr.send();

    const totalSize = file.size;
    let uploadedSize = 0;
    const chunkSize = totalSize / 100;

    const uploadInterval = setInterval(() => {
      uploadedSize += chunkSize;
      setUploadProgress(Math.min((uploadedSize / totalSize) * 100, 100));
      if (uploadedSize >= totalSize) clearInterval(uploadInterval);
    }, 50);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Upload</CardTitle>
        <CardDescription>Upload your data files. Supported format: CSV</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-7rem)]">
        <motion.div
          className={`relative h-full border-2 border-dashed rounded-lg p-8 flex items-center justify-center ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" className="hidden" id="file-upload" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelection(file); // Only call if a file is selected
            }} accept=".csv" />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-16 w-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium">
                  Drag and drop your file here, or{' '}
                  <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
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
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearSelection} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-center text-sm text-gray-500">
                {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload complete!'}
              </p>
            </div>
          )}
        </motion.div>
        <Button onClick={logout} className="mt-4 bg-red-500 text-white">Logout</Button>
      </CardContent>
    </Card>
  );
}