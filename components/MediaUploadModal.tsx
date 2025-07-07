import React from 'react'
import dynamic from 'next/dynamic'

const FileUploaderRegular = dynamic(
  () => import('@uploadcare/react-uploader').then(mod => mod.FileUploaderRegular),
  { ssr: false }
)

function MediaUploadModal() {
  return (
    <FileUploaderRegular
        sourceList="local"
        classNameUploader="uc-light"
        pubkey="3b1f1c32502a35fc73cc"
    />
  )
}

export default MediaUploadModal