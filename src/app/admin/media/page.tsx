import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { MediaLibraryClient } from './MediaLibraryClient';

export default async function MediaPage() {
  const uploadDir = join(process.cwd(), 'public/uploads');
  let files: { name: string; url: string; size: number; date: Date }[] = [];

  try {
    const filenames = await readdir(uploadDir);
    
    // Get file stats
    const fileStats = await Promise.all(
      filenames.map(async (filename) => {
        const stats = await stat(join(uploadDir, filename));
        return {
          name: filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          date: stats.mtime
        };
      })
    );
    
    // Sort by date descending
    files = fileStats.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    // If directory doesn't exist, it's fine, files will be empty
  }

  return (
    <div className="space-y-6 animate-stagger-item max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">کتابخانه چندرسانه‌ای</h1>
      </div>
      
      <MediaLibraryClient initialFiles={files} />
    </div>
  );
}
