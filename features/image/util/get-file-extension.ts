export const getFileExtension = (file: File): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const arr = new Uint8Array(buffer).subarray(0, 4);
        const header = Array.from(arr)
          .map((byte) => byte.toString(16))
          .join('');

        let extension: string | undefined;

        const PNG_HEADER = '89504e47';
        const JPG_HEADERS = [
          'ffd8ffe0',
          'ffd8ffe1',
          'ffd8ffe2',
          'ffd8ffe3',
          'ffd8ffe8',
        ];
        const WEBP_HEADER = '52494646';
        const WEBP_SECOND_HEADER = '57454250';
        const JFIF_HEADER = '4a464946';
        const PJPEG_HEADERS = ['ffdaffe0', 'ffdaffe1', 'ffdaffe2'];
        const PJP_HEADERS = ['ffdbffe0', 'ffdbffe1', 'ffdbffe2'];

        switch (header) {
          case PNG_HEADER:
            extension = 'png';
            break;
          case JFIF_HEADER:
            extension = 'jfif';
            break;
          case WEBP_HEADER:
            if (buffer.byteLength >= 12) {
              const secondHeader = new Uint8Array(buffer).subarray(8, 12);
              const secondHeaderHex = Array.from(secondHeader)
                .map((byte) => byte.toString(16))
                .join('');
              if (secondHeaderHex === WEBP_SECOND_HEADER) {
                extension = 'webp';
              }
            }
            break;
          default:
            if (JPG_HEADERS.includes(header)) {
              extension = 'jpg';
            } else if (PJPEG_HEADERS.includes(header)) {
              extension = 'pjpeg';
            } else if (PJP_HEADERS.includes(header)) {
              extension = 'pjp';
            }
            break;
        }

        if (!extension && file.type === 'image/heic')
          resolve(file.type.split('/')[1]);
        resolve(extension);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.readAsArrayBuffer(file);
  });
};
