import { render, screen } from '@testing-library/react'
import { LegacyAccess } from './LegacyAccess'

describe('Who Can Do What?', () => {
  it('foo', () => {
    render(<LegacyAccess />)
    expect(screen.getByTestId('perm-users.read')).toHaveAttribute('data-status','fixme')
  })
})
