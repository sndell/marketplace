'use client';

import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Control, FieldError, FieldErrorsImpl, Merge, useController } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useUploadImages } from '@/features/image';
import { cn } from '@/util/cn';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListingValues } from '@/features/listing/schema';

type Props = {
  control: Control<ListingValues>;
  error?:
    | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<{ url: string; id: string }>> | undefined)[]>
    | undefined
    | FieldError;
  label?: string;
  description?: string;
  isRequired?: boolean;
  maxImages?: number;
};

export const MultipleImages = ({ control, description, error, isRequired, label, maxImages = 0 }: Props) => {
  const {
    field: { value: images, onChange },
  } = useController({
    name: 'images',
    control,
    defaultValue: [],
  });
  const [tempImages, setTempImages] = useState(0);
  const { uploadImages } = useUploadImages();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => {
        const extension = file.type.split('/')[1];
        return { file, id: uuid(), extension: `.${extension}` };
      });

      const validImages = newImages.filter(Boolean);
      if (validImages.length === 0) return;

      setTempImages(validImages.length);

      try {
        const uploadedImages = await uploadImages(
          validImages.map((image) => image!.file),
          validImages.map((image) => image!.extension)
        );
        onChange([...images, ...uploadedImages]);
      } catch (error) {
        console.error(error);
      } finally {
        setTempImages(0);
      }
    },
    [images, onChange, uploadImages]
  );

  const handleDelete = (id: string) => onChange(images.filter((image) => image.id !== id));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(MouseSensor)
  );

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-sm ">
          <div className="font-medium">
            {label}
            {isRequired && <span className="text-error">*</span>}
            {error && <span className="font-normal text-error"> {error.message}</span>}
          </div>
          {description && <div className="text-sm text-primaryLight py-1">{description}</div>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((image) => image.id)}>
            {images.map((image: { url: string; id: string }, index: number) => (
              <SortableImage key={index} {...image} index={index} handleDelete={handleDelete} />
            ))}
          </SortableContext>
          {[...Array(tempImages)].map((_, index) => (
            <TempImage key={index} />
          ))}
          {images.length < maxImages - tempImages && (
            <Dropzone
              onDrop={onDrop}
              maxFiles={maxImages - images.length}
              accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/webp': ['.webp'],
              }}
              maxSize={20971520}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    'border cursor-pointer border-dashed rounded-xl flex px-2 flex-col items-center justify-center text-center gap-2 text-primaryLight',
                    images.length === 0 && tempImages === 0 ? 'col-span-2 py-12' : 'aspect-square'
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="icon-[solar--gallery-add-linear] text-3xl" />
                  <p className="text-primaryLight max-xs:hidden">Släpp dina bilder här</p>
                  <p className="text-primaryLight xs:hidden">Klicka för att välja bilder</p>
                </div>
              )}
            </Dropzone>
          )}
        </DndContext>
      </div>
    </div>
  );
};

const TempImage = () => (
  <div className="relative w-full overflow-hidden border rounded-xl border-secondary aspect-square">
    <div className="absolute inset-0 grid h-full place-items-center">
      <span className="icon-[svg-spinners--ring-resize] text-2xl text-primaryLight" />
    </div>
  </div>
);

const SortableImage = ({
  url,
  index,
  id,
  handleDelete,
}: {
  url: string;
  index: number;
  id: string;
  handleDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      key={url}
      id={url}
      style={style}
      className="relative w-full overflow-hidden border rounded-xl border-secondary aspect-square touch-manipulation"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`image-${index}`}
        className="object-cover border-b aspect-square rounded-xl border-secondary"
        height={1080}
        width={1080}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      />
      <div className="absolute bottom-0 flex justify-between w-full px-3 py-2 bg-primary">
        {index + 1}
        <button type="button" onClick={() => handleDelete(id)}>
          Ta bort
        </button>
      </div>
    </div>
  );
};
