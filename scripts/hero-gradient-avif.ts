// biome-ignore lint/correctness/noUndeclaredDependencies: sharp is installed with next
import sharp from 'sharp'

const widths = [640, 750, 828, 1080, 1200, 1408]
const outDir = process.argv[2] ?? 'public/images/hero-gradient'

for (const width of widths) {
  await sharp('public/images/hero-gradient.png')
    .resize({ width })
    .avif({ quality: 80 })
    .toFile(`${outDir}/${width}.avif`)
}
