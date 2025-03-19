import { motion } from 'framer-motion';
import { BarChart3, Upload } from 'lucide-react';
import { useState } from 'react';
import { DataUpload } from './components/DataUpload';
import { DataVisualization } from './components/DataVisualization';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 shadow-sm"
      >
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Sierra Impact
            </motion.h1>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 w-full p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Data Collection
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visualization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="h-[calc(100vh-12rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <DataUpload />
            </motion.div>
          </TabsContent>

          <TabsContent value="visualization" className="h-[calc(100vh-12rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <DataVisualization />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <Separator />

      <footer className="w-full px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2025 Sierra Impact. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;