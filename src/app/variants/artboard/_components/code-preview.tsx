import type { CodeValue, SelectionInfo } from './selection'

function Value({ value }: { value: CodeValue }) {
  if (typeof value === 'string') {
    return <span className='text-(--path)'>&quot;{value}&quot;</span>
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return (
      <>
        {'{'}
        <span className='text-(--sel)'>{String(value)}</span>
        {'}'}
      </>
    )
  }
  return (
    <>
      {'{['}
      {value.map((item, i) => (
        <span key={item}>
          <span className='text-(--path)'>&quot;{item}&quot;</span>
          {i < value.length - 1 ? ', ' : ''}
        </span>
      ))}
      {']}'}
    </>
  )
}

/** The Code tab: the selected layer as the JSX that would render it. */
export function CodePreview({ info }: { info: SelectionInfo }) {
  if (!info.code) {
    return (
      <p className='ab-t-label text-(--muted)'>
        No component for this layer. Select a card to see its props.
      </p>
    )
  }
  const { component, props } = info.code
  return (
    <pre className='ab-mono overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-(--board) p-3 text-[11px] leading-[18px]'>
      <code>
        <span className='text-(--faint)'>{'<'}</span>
        <span className='text-(--component)'>{component}</span>
        {props.map(([key, value]) => (
          <span className='block pl-3' key={key}>
            <span className='text-(--muted)'>{key}</span>
            <span className='text-(--faint)'>=</span>
            <Value value={value} />
          </span>
        ))}
        <span className='text-(--faint)'>{'/>'}</span>
      </code>
    </pre>
  )
}
