import ReactMarkdown from 'react-markdown'

type Props = {
  markdown: string
}

function LinkRenderer(props: any) {
  return (
    <a href={props.href} target='_blank' rel='noreferrer'>
      {props.children}
    </a>
  )
}

export function Notes({ markdown }: Props) {
  return (
    <div className='rounded-md border border-neutral-900 bg-neutral-800 p-2'>
      <ReactMarkdown className='prose prose-sm prose-invert' components={{ a: LinkRenderer }}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
