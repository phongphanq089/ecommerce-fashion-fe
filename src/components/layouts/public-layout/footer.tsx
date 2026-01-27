const Footer = () => {
  return (
    <footer className='py-12 px-8 flex flex-col md:flex-row justify-between items-center z-10 text-white/50 border-t border-white/10'>
      <div className='flex gap-8 mb-6 md:mb-0'>
        <a className='hover:text-white transition-colors' href='#'>
          <span className='sans-minimal text-[9px] uppercase tracking-[0.2em]'>
            Instagram
          </span>
        </a>
        <a className='hover:text-white transition-colors' href='#'>
          <span className='sans-minimal text-[9px] uppercase tracking-[0.2em]'>
            Pinterest
          </span>
        </a>
        <a className='hover:text-white transition-colors' href='#'>
          <span className='sans-minimal text-[9px] uppercase tracking-[0.2em]'>
            Vogue Business
          </span>
        </a>
      </div>
      <div className='text-center md:text-right'>
        <p className='sans-minimal text-[8px] uppercase tracking-[0.2em]'>
          © 2024 Maison Elegance • All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
