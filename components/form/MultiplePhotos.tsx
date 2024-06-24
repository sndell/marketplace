'use client';

import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Control, FieldError, FieldErrorsImpl, Merge, useController } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { getFileExtension, useUploadImages } from '@/features/image';
import { cn } from '@/util/cn';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListingValues } from '@/features/listing/schema';

type Props = {
  control: Control<ListingValues>;
  errors?:
    | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<{ url: string; id: string }>> | undefined)[]>
    | undefined
    | FieldError;
  label?: string;
  description?: string;
  isRequired?: boolean;
  maxPhotos?: number;
};

export const MultiplePhotos = ({ control, description, errors, isRequired, label, maxPhotos = 0 }: Props) => {
  const {
    field: { value: photos, onChange },
  } = useController({
    name: 'photos',
    control,
    defaultValue: [],
  });
  const [tempPhotos, setTempPhotos] = useState(0);
  const { uploadImages } = useUploadImages();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newPhotos = await Promise.all(
        acceptedFiles.map(async (file) => {
          const extension = await getFileExtension(file);
          return extension ? { file, id: uuid(), extension: `.${extension}` } : null;
        })
      );

      const validPhotos = newPhotos.filter(Boolean);
      if (validPhotos.length === 0) return;

      setTempPhotos(validPhotos.length);

      try {
        const uploadedPhotos = await uploadImages(
          validPhotos.map((photo) => photo!.file),
          validPhotos.map((photo) => photo!.extension)
        );
        onChange([...photos, ...uploadedPhotos]);
      } catch (error) {
        console.error(error);
      } finally {
        setTempPhotos(0);
      }
    },
    [photos, onChange, uploadImages]
  );

  const handleDelete = (id: string) => onChange(photos.filter((photo) => photo.id !== id));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      const oldIndex = photos.findIndex((photo) => photo.id === active.id);
      const newIndex = photos.findIndex((photo) => photo.id === over.id);
      onChange(arrayMove(photos, oldIndex, newIndex));
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
            {errors && <span className="font-normal text-error"> {errors.message}</span>}
          </div>
          {description && <div className="text-sm text-primaryLight py-1">{description}</div>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((photo) => photo.id)}>
            {photos.map((photo: { url: string; id: string }, index: number) => (
              <Photo key={index} {...photo} index={index} handleDelete={handleDelete} />
            ))}
          </SortableContext>
          {[...Array(tempPhotos)].map((_, index) => (
            <TempPhoto key={index} />
          ))}
          {photos.length < maxPhotos - tempPhotos && (
            <Dropzone
              onDrop={onDrop}
              maxFiles={maxPhotos - photos.length}
              accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/webp': ['.webp'],
              }}
              maxSize={20000000}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    'border cursor-pointer border-dashed rounded-xl flex px-2 flex-col items-center justify-center text-center gap-2 text-primaryLight',
                    photos.length === 0 && tempPhotos === 0 ? 'col-span-2 py-12' : 'aspect-square'
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

const TempPhoto = () => (
  <div className="relative w-full overflow-hidden border rounded-xl border-secondary aspect-square">
    <div className="absolute inset-0 grid h-full place-items-center">
      <span className="icon-[svg-spinners--ring-resize] text-2xl text-primaryLight" />
    </div>
  </div>
);

const Photo = ({
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
        alt={`photo-${index}`}
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
