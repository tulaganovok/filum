export default function Footer() {
  return (
    <footer className='fixed bottom-0 w-full p-3 border-t-2'>
      <p className='text-center text-sm text-muted-foreground'>
        &copy;Copyright Filum {new Date().getFullYear()}. All rights reserved.
      </p>
    </footer>
  )
}
