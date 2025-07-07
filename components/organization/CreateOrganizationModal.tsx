'use client'

import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ImageIcon, X } from 'lucide-react'
import { useOrganizationList } from '@clerk/nextjs'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '../ui/button'

interface CreateOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const { createOrganization } = useOrganizationList()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
  })
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!createOrganization) {
        throw new Error('Failed to initialize organization creation')
      }
      await createOrganization({
        name: formData.name,
        slug: formData.slug,
        ...(logoFile && { imageFile: logoFile }),
      })
      toast.success('Organization created successfully!')
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo file size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-stone-800 rounded-2xl max-w-lg w-full mx-4 p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 dark:text-gray-100 dark:hover:text-gray-500 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>

                <Dialog.Title className="text-xl font-semibold dark:text-white/80 text-gray-900 mb-6">
                  Create New Organization
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Logo Upload Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative h-20 w-20 rounded-lg border-2 border-dashed dark:border-stone-700 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Organization Logo"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white/80 mb-1">Organization Logo</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Upload a logo for your organization. Max size 5MB.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleLogoClick}
                        >
                          {logoFile ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        {logoFile && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemoveLogo}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter organization name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Slug
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter organization slug"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      This will be used in your organization&apos;s URL. Use lowercase letters, numbers, and hyphens only.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.slug}
                    className="w-full h-11 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create Organization'}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 