"use client";

import { useState, useEffect } from "react";
import { storage, databases, account } from "@/lib/appwrite";
import { ID, Permission, Role } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, FileText } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js - use the local worker from public directory
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';
}

// Props received from the Dashboard page
interface FileUploaderProps {
  shopId: string;
  config: {
    type: string;   // 'bw' or 'color'
    copies: string;
  };
  priceBw: number;
  priceColor: number;
}

export function FileUploader({ shopId, config, priceBw, priceColor }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loadingPages, setLoadingPages] = useState(false);
  const { toast } = useToast();

  // Count PDF pages when file is selected
  useEffect(() => {
    if (file && file.type === 'application/pdf') {
      countPdfPages(file);
    } else {
      setPageCount(0);
    }
  }, [file]);

  const countPdfPages = async (pdfFile: File) => {
    setLoadingPages(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
    } catch (error) {
      console.error('Error counting PDF pages:', error);
      toast({
        title: "Warning",
        description: "Could not count PDF pages. Price may be inaccurate.",
        variant: "destructive"
      });
      setPageCount(1); // Default to 1 page if counting fails
    } finally {
      setLoadingPages(false);
    }
  };

  const handleUploadAndOrder = async () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a PDF file.", variant: "destructive" });
      return;
    }
    if (!shopId) {
      toast({ title: "Error", description: "Please select a shop first.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 0: Get Current User (Student)
      const user = await account.get();

      // Step 1: Upload File to Appwrite Storage
      const bucketId = process.env.NEXT_PUBLIC_BUCKET_FILES!;
      const fileUpload = await storage.createFile(
        bucketId,
        ID.unique(),
        file,
        [
          Permission.read(Role.user(user.$id)), // Student can read
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          Permission.read(Role.any()), // Temporary: Allow anyone to read so Shop Owner can download
        ],
        (progressEvent: any) => {
          const percent = Math.round((progressEvent.progress / progressEvent.total) * 100);
          setProgress(percent);
        }
      );

      // Step 2: Create Order in Database
      const dbId = process.env.NEXT_PUBLIC_DB_ID!;
      const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ORDERS!;

      await databases.createDocument(
        dbId,
        collectionId,
        ID.unique(),
        {
          studentId: user.$id,
          shopId: shopId,
          fileId: fileUpload.$id,
          status: 'pending',
          config: JSON.stringify(config), // Save settings: {"type":"bw","copies":"1"}
          totalAmount: calculatePrice(config.type, config.copies, pageCount),
          orderDate: new Date().toISOString(),
          // created_at is automatically handled by Appwrite
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          Permission.read(Role.any()), // Temporary: Allow shop owner to see it
        ]
      );

      toast({
        title: "Order Placed!",
        description: "Your file has been sent to the shop.",
        className: "bg-green-600 text-white"
      });

      // Reset form
      setFile(null);
      setProgress(0);

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not place order.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Helper to calculate price: pages × copies × price_per_page
  const calculatePrice = (type: string, copies: string, pages: number = 1) => {
    const rate = type === 'color' ? priceColor : priceBw;
    const numCopies = parseInt(copies) || 1;
    const numPages = pages || 1;
    return rate * numCopies * numPages;
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload PDF</span></p>
              <p className="text-xs text-gray-500">Max 50MB</p>
            </div>
            <Input
              id="dropzone-file"
              type="file"
              accept=".pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {file && (
          <div className="space-y-2">
            <p className="text-sm text-blue-600 font-medium text-center">Selected: {file.name}</p>
            {loadingPages ? (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Counting pages...</span>
              </div>
            ) : pageCount > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-700 bg-gray-50 py-2 px-3 rounded-md">
                <FileText className="h-4 w-4" />
                <span className="font-semibold">{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-1">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-gray-500 text-right">{progress}%</p>
        </div>
      )}

      <Button
        onClick={handleUploadAndOrder}
        disabled={!file || uploading || loadingPages}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            {pageCount > 0 && (
              <span className="mr-2 text-xs opacity-80">
                {pageCount}pg × {config.copies}copy × {config.type === 'color' ? priceColor : priceBw}৳ =
              </span>
            )}
            <span>Pay & Print ({calculatePrice(config.type, config.copies, pageCount)}৳)</span>
          </>
        )}
      </Button>
    </div>
  );
}