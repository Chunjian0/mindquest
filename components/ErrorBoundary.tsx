'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          height:         '100%',
          gap:            '16px',
          padding:        '32px',
          textAlign:      'center',
        }}>
          <div style={{ fontSize: '48px' }}>🌙</div>
          <div style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize:   '20px',
            color:      'rgba(200,180,255,0.9)',
          }}>
            Mochi got a little lost...
          </div>
          <div style={{
            fontSize:   '13px',
            fontWeight: 600,
            color:      'rgba(140,120,180,0.6)',
            maxWidth:   '280px',
            lineHeight: 1.6,
          }}>
            Something went quietly wrong. Mochi is resting.
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            style={{
              background:   'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(96,165,250,0.15))',
              border:       '1px solid rgba(168,85,247,0.3)',
              borderRadius: '12px',
              padding:      '10px 24px',
              color:        'rgba(200,180,255,0.9)',
              fontFamily:   "'Fredoka One', cursive",
              fontSize:     '14px',
              cursor:       'pointer',
            }}
          >
            Come back ✦
          </button>

          {/* 开发模式显示错误详情 */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop:  '16px',
              fontSize:   '11px',
              color:      '#f87171',
              maxWidth:   '400px',
              textAlign:  'left',
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Error details
              </summary>
              <pre style={{
                background:   'rgba(0,0,0,0.3)',
                padding:      '10px',
                borderRadius: '8px',
                overflow:     'auto',
                fontSize:     '10px',
              }}>
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}