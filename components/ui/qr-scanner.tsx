"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
  isOpen: boolean
}

export function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen, isScanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setError(null)
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const handleScan = (mockData: string) => {
    // Mock QR scan - in real app would use QR detection library
    setScanResult("success")
    setTimeout(() => {
      onScan(mockData)
      setScanResult(null)
      onClose()
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute inset-4 md:inset-8"
          >
            <Card className="h-full bg-background/95 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">Scan QR Code</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 p-4 flex flex-col items-center justify-center">
                {error ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => setIsScanning(true)}>Try Again</Button>
                  </motion.div>
                ) : !isScanning ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <Camera className="h-16 w-16 text-primary mx-auto" />
                    <p className="text-muted-foreground">Ready to scan QR codes</p>
                    <Button onClick={() => setIsScanning(true)}>Start Scanning</Button>
                  </motion.div>
                ) : (
                  <div className="relative w-full max-w-sm aspect-square">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />

                    {/* Scanning overlay */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary rounded-lg"
                      animate={{
                        boxShadow: ["0 0 0 0 rgba(0, 132, 255, 0.4)", "0 0 0 10px rgba(0, 132, 255, 0)"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                    />

                    {/* Scan line animation */}
                    <motion.div
                      className="absolute left-4 right-4 h-0.5 bg-primary"
                      animate={{ y: [0, 200, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Mock scan button for demo */}
                    <Button
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      onClick={() => handleScan("event-123")}
                    >
                      Simulate Scan
                    </Button>
                  </div>
                )}

                {/* Scan result feedback */}
                <AnimatePresence>
                  {scanResult && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm"
                    >
                      {scanResult === "success" ? (
                        <div className="text-center space-y-2">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                          <p className="text-lg font-semibold">Scan Successful!</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
                          <p className="text-lg font-semibold">Scan Failed</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
