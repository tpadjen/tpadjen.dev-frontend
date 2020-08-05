import React from 'react'
import { Colors } from '../../../../theme'
import styled from 'styled-components'
import './Sidebar.css'
import FadeIn from '../../../../components/animations/FadeIn'


const SidebarItem = ({ name, icon, show, color, selected, onSelected }) => {
  if (!show) return null

  return (
    <FadeIn
      color={color}
      background={Colors.background}
    >
      <SideBarLi
        className={`SidebarItem ${selected ? 'selected' : ''}`}
        background={color}
        color={Colors.terminal}
        selected={selected}
        onClick={onSelected}
      >
        <div className="sidebar-text">
          {icon}
          <h2>{name}</h2>
        </div>
      </SideBarLi>
    </FadeIn>
  )
}

const SideBarLi = styled.li`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  transition: 0.12s all ease-in-out;
  transition-property: background-color color;

  &:hover {
    background-color: ${(props) => props.color};
    color: ${(props) => props.background};
    cursor: pointer;

    .sidebar-text {
      transition: 0.12s transform ease-in-out;
      transform: scale(1.3)
    }
  }

  &.selected {
    background-color: ${Colors.terminal};
    color: ${(props) => props.background};

    &:hover {
      background-color: ${Colors.terminal};
      color: ${(props) => props.background};
      cursor: pointer;
    }

    .sidebar-text {
      transition: 0.12s transform ease-in-out;
      transform: scale(1.3)
    }
  }
`


const Sidebar = ({ visibleItems, items, selected, onSelection }) => {

  const onSelected = (name) => {
    onSelection(name)
  }

  return (
    <aside className="Sidebar">
      <nav>
        <ul>
          {items.map(item => (
            <SidebarItem
              key={item.name}
              show={visibleItems.includes(item.name)}
              name={item.name}
              icon={item.icon}
              color={item.color}
              selected={selected === item.name}
              onSelected={() => onSelected(item.name)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
