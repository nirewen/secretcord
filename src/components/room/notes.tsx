import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { autoLinkMd } from 'react-markdown-autolink'

type Props = {
  className?: string
  markdownClassName?: string
  markdown: string
}

function LinkRenderer(props: any) {
  return (
    <a href={props.href} target='_blank' rel='noreferrer'>
      {props.children}
    </a>
  )
}

export function Notes({ className, markdownClassName, markdown }: Props) {
  return (
    <div className={cn('rounded-md border border-neutral-900 bg-neutral-800 p-2 overflow-x-auto', className)}>
      <ReactMarkdown
        className={cn('prose prose-sm prose-invert break-words', markdownClassName)}
        components={{ a: LinkRenderer }}
      >
        {autoLinkMd(markdown)}
      </ReactMarkdown>
    </div>
  )
}
