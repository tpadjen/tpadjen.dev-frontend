import React, { useState, useEffect, useRef } from 'react'
import {
  FaUserCircle,
  FaPhoneAlt,
} from 'react-icons/fa'
import {
  IoMdMail
} from 'react-icons/io'
import {
  FiLogOut
} from 'react-icons/fi'
// import {
//   GoTriangleDown
// } from 'react-icons/go'
import {
  GiHamburgerMenu
} from 'react-icons/gi'
import styled from 'styled-components'
import { Colors } from '../../../../theme'
import { useContactInfo } from '../../services/contact-info'
import { useUser } from '../../../../auth/UserProvider'


const Menu = () => {
  const contactInfo = useContactInfo()
  const { user, userService } = useUser()
  const [showingMenu, setShowingMenu] = useState(false)
  const menuRef = useRef()

  // onWindowClick does not see changes to showingMenu,
  // so I need another ref to track it
  const showingStateRef = React.useRef(showingMenu)

  const onWindowClick = (event) => {
    if (showingStateRef.current && menuRef.current && !menuRef.current.contains(event.target)) {
      setShowingMenu(false)
    }
    return false
  }

  useEffect(() => {
    window.addEventListener('click', onWindowClick)

    return () => window.removeEventListener('click', onWindowClick)
  }, [])

  const toggleMenu = () => {
    setShowingMenu((showing) => {
      showingStateRef.current = !showing
      return !showing
    })
  }

  const onSignOut = () => {
    userService.logout()
  }

  return (
    <StyledMenu>
      <div className="wide">
        <MenuOption>
          <IoMdMail />
          <HoverMenu arrowShift="75.5%">{contactInfo &&
          <a href="mailto:contactInfo.email">{contactInfo.email}</a>
          }</HoverMenu>
        </MenuOption>
        <MenuOption>
          <FaPhoneAlt />
          <HoverMenu arrowShift="72%">{contactInfo &&
          <a href={`tel:${contactInfo.phone}`}>{contactInfo.readablePhone}</a>
          }</HoverMenu>
        </MenuOption>
        <MenuOption>
          <FaUserCircle />
          <HoverMenu arrowShiftEnd="1.6em" >{contactInfo && (
            <SignOutMenu>
              <div className="username">{user.name}</div>
              <hr />
              <SignOutLink
                onClick={onSignOut}
              >
                <a><FiLogOut />
                  <div>Sign Out</div>
                </a>
              </SignOutLink>
            </SignOutMenu>
          )}</HoverMenu>
        </MenuOption>
      </div>
      <div className="small">
        <MenuOption ref={menuRef}>
          <GiHamburgerMenu onClick={toggleMenu} />
          <HoverMenu arrowShift="92%" className={ showingMenu ? 'show' : 'hide' }>
            <SignOutMenu>
              <div className="username">{user.name}</div>
              <hr />
              <SignOutLink
                onClick={onSignOut}
              >
                <a><FiLogOut />
                  <div>Sign Out</div>
                </a>
              </SignOutLink>
              <hr />
              <div className="contact-desc">My Contact Info</div>
              <InlineContact>
                <IoMdMail />
                <div>{contactInfo &&
                  <a href="mailto:contactInfo.email">{contactInfo.email}</a>
                }</div>
              </InlineContact>
              <InlineContact>
                <FaPhoneAlt />
                <div>{contactInfo &&
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.readablePhone}</a>
                }</div>
              </InlineContact>
            </SignOutMenu>
          </HoverMenu>
        </MenuOption>
      </div>
    </StyledMenu>
  )
}

const InlineContact = styled.div`
  display: flex;
  flex-direction: row;

  color: ${Colors.me};

  svg {
    font-size: 0.6em;
    position: relative;
    top: 0.8em;
  }

  div {
    padding-left: 0.5em;
  }
`

const MenuOption = styled.div`
  padding: 0 0.5em;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 575.98px) {
    padding: 4px;
  }
`

const HoverMenu = styled.div`
  padding: 0.5em 0.6em 0.7em 0.6em;
  background: ${Colors.backgroundLighter};
  color: ${Colors.text};
  display: none;
  position: absolute;
  right: -1em;
  top: calc(100% + 0.4em);
  border-radius: 0.5em;
  z-index: 9999;

  &.show {
    display: block;
  }

  a, a:visited {
    font-size: 0.8em;
    color: ${Colors.me};
    text-decoration: none;
    white-space: nowrap;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 575.98px) {
    a, a:visited {
      font-size: 0.7em;
    }
  }

  ::after {
    content: " ";
    content: " ";
    position: absolute;
    bottom: 100%;  /* At the top of the tooltip */
    left: ${(props) => props.arrowShift ? props.arrowShift : undefined};
    right: ${(props) => props.arrowShiftEnd ? props.arrowShiftEnd : undefined};
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent ${Colors.backgroundLighter} transparent;
  }
`

const StyledMenu = styled.nav`
  position: absolute;
  right: 1em;
  color: ${Colors.me};
  display: flex;
  flex-direction: row;
  z-index: 999;
  font-size: 1.5em;

  .small {
    display: none;
  }

  .wide {
    display: flex;
    flex-direction: row;

    ${MenuOption}:hover ${HoverMenu} {
      display: block;
    }
  }

  @media (max-width: 575.98px) {
    right: 0.5em;
    font-size: 2em;

    .small {
      display: inherit;

      ${HoverMenu} {
        right: 0;
      }
    }

    .wide {
      display: none;
    }
  }
`

// const Triangle = styled(GoTriangleDown)`
//   font-size: 0.6em;
//   position: relative;
//   padding-right: 0.2em;
//   top: 0.3em;
// `

const SignOutMenu = styled.div`

  .username {
    white-space: no-wrap;
    overflow: hidden;
    font-size: 0.9em;
  }

  .contact-desc {
    font-size: 0.6em;
    color: ${Colors.code};
  }

  @media (max-width: 575.98px) {
    .username {
      font-size: 0.8em;
    }
  }
`

const SignOutLink = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  a {
    display: flex;
    cursor: pointer;
    div {
      margin-left: 0.5em;
    }
  }

  svg {
    font-size: 1.1em;
  }
`

export default Menu
