// Utility to test Uploadcare configuration and connectivity
export const testUploadcareConnection = async (publicKey: string, signature: string, expire: string) => {
  try {
    console.log('Testing Uploadcare connection with:', { publicKey, expire, hasSignature: !!signature });
    
    // Test if Uploadcare script is loaded
    if (typeof window === 'undefined') {
      throw new Error('Window is not available (SSR context)');
    }
    
    const uploadcareWindow = window as any;
    if (!uploadcareWindow.uploadcare) {
      throw new Error('Uploadcare script not loaded');
    }
    
    console.log('Uploadcare script loaded successfully');
    console.log('Available methods:', Object.keys(uploadcareWindow.uploadcare));
    
    // Test API connectivity by creating a simple test request
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    console.log('Testing file upload with test file...');
    
    const result = await uploadcareWindow.uploadcare.fileFrom('object', testFile, {
      publicKey,
      signature,
      expire,
    });
    
    console.log('Test upload successful:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('Uploadcare test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Check if Uploadcare is ready
export const waitForUploadcare = (timeout = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkUploadcare = () => {
      if (typeof window !== 'undefined' && (window as any).uploadcare) {
        console.log('Uploadcare is ready');
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        console.error('Uploadcare loading timeout');
        resolve(false);
        return;
      }
      
      setTimeout(checkUploadcare, 100);
    };
    
    checkUploadcare();
  });
};
