import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSpring, config } from 'react-spring'
import {
  FaSmile,
  FaUserTie,
  FaLightbulb,
  FaChalkboardTeacher,
  FaGuitar
} from 'react-icons/fa'
import { GoCode } from 'react-icons/go'
import {
  Hi,
  Me,
  Code,
  Teach,
  Create,
  Learn,
} from './Topics/topics'
import { Colors } from '../../theme'
import { MediaSizes } from '../../theme'
import { useMedia, useLocation } from 'react-use'


const step = 1200
const topicStart = 2700
const colorOffset = -100
const times = {
  hi: 100,
  me: 1300,
  code: topicStart + step * 0,
  teach: topicStart + step * 1,
  create: topicStart + step * 2,
  learn: topicStart + step * 3,
  end: topicStart + step * 4,
  out: 800,
}

const pagePath = '/profile'

const pages = [
  {
    name: 'Hi',
    icon: <FaSmile />,
    color: Colors.hi,
    component: Hi,
    wait: 100,
    path: `${pagePath}/hi`
  },
  {
    name: 'Work',
    icon: <FaUserTie />,
    color: Colors.me,
    component: Me,
    wait: 1300,
    path: `${pagePath}/me`
  },
  {
    name: 'Code',
    icon: <GoCode />,
    color: Colors.code,
    component: Code,
    wait: times.code + colorOffset,
    path: `${pagePath}/code`
  },
  {
    name: 'Teach',
    icon: <FaChalkboardTeacher />,
    color: Colors.teach,
    component: Teach,
    wait: times.teach + colorOffset,
    path: `${pagePath}/teach`
  },
  {
    name: 'Create',
    icon: <FaGuitar />,
    color: Colors.create,
    component: Create,
    wait: times.create + colorOffset,
    path: `${pagePath}/create`
  },
  {
    name: 'Learn',
    icon: <FaLightbulb />,
    color: Colors.learn,
    component: Learn,
    wait: times.learn + colorOffset,
    path: `${pagePath}/learn`
  }
]

export const createAnimations = (currentColor) => {
  return {
    welcome: [
      { text: 'Hi', start: 1 },
      { text: ", I'm ", start: 500 },
      { text: 'Tim', start: 800, color: currentColor },
      { text: '. ', start: 1100 }
    ],
    topicsI: [
      { text: ' I  ', start: 2100, end: times.end }
    ],
    topics: [
      { text: 'code ', start: times.code, color: Colors.code },
      { text: 'code ', start: times.code + times.out, color: Colors.code, out: true },
      { text: 'teach ', start: times.teach, color: Colors.teach },
      { text: 'teach ', start: times.teach + times.out, color: Colors.teach, out: true },
      { text: 'create ', start: times.create, color: Colors.create },
      { text: 'create ', start: times.create + times.out, color: Colors.create, out: true },
      { text: 'learn ', start: times.learn, color: Colors.learn }
    ],
    icons: [
      { icon: <GoCode />, start: times.code, color: Colors.code },
      { icon: <GoCode />, start: times.code + times.out, color: Colors.code, out: true },
      { icon: <FaChalkboardTeacher />, start: times.teach, color: Colors.teach },
      { icon: <FaChalkboardTeacher />, start: times.teach + times.out, color: Colors.teach, out: true },
      { icon: <FaGuitar />, start: times.create, color: Colors.create },
      { icon: <FaGuitar />, start: times.create + times.out, color: Colors.create, out: true },
      { icon: <FaLightbulb />, start: times.learn, color: Colors.learn }
    ]
  }
}

export const useManageProfile = () => {
  const [currentColor, setCurrentColor] = useState(Colors.hi)
  const [selectedTopic, setSelectedTopic] = useState(undefined)
  const [topicSentence, setTopicSentence] = useState(null)
  const [showSentence, setShowSentence] = useState(false)
  const [visibleItems, setVisibleItems] = useState([])
  const [shouldNotAnimate, setShouldNotAnimate] = useState(false)
  const [animationsCompleting, setAnimationsCompleting] = useState(false)
  const [animationsComplete, setAnimationsComplete] = useState(false)
  const isSmall = useMedia(MediaSizes.small)
  const profileRef = useRef()
  const history = useHistory()
  const loc = useLocation()

  useEffect(() => {
    if (loc.pathname !== '/profile') {
      setShouldNotAnimate(true)
      if(!animationsCompleting) {
        setAnimationsCompleting(true)
        setAnimationsComplete(true)
        setCurrentColor(Colors.me)
        pages.forEach(item => showItem(item.name))
        setTimeout(() => {
          setShowSentence(true)
        }, 1500)
      }

      let pageName = loc.pathname.replace('/profile/', '')
      if (pageName.match('/')) pageName = pageName.split('/')[0]
      const selectedItem = pages.find(page => page.path === `/profile/${pageName}`)
      if (selectedItem) setSelectedTopic(selectedItem.name)
    }
  }, [loc])

  useEffect(() => {
    const selectedPage = pages.find(item => item.name === selectedTopic)
    const sentence = selectedPage && showSentence
      && ['Code', 'Teach', 'Create', 'Learn'].includes(selectedPage.name)
      ? (
        <>
          <pre style={{ color: Colors.text }}> I  </pre>
          <pre
            style={{
              color: selectedPage.color
            }}
          >{selectedTopic.toLowerCase()} </pre>
          <pre
            style={{
              color: selectedPage.color
            }}
          >{selectedPage.icon}</pre>
        </>
      )
      : null

    setTopicSentence(sentence)
  }, [selectedTopic, showSentence])


  const showItem = (item) => {
    setVisibleItems(items => items.concat(item))
  }

  const showItemLater = (item) => {
    setTimeout(() => {
      setCurrentColor(item.color)
      showItem(item.name)
    }, item.wait)
  }

  const onBlockComplete = () => {
    pages.forEach(item => showItemLater(item))

    setTimeout(() => {
      setCurrentColor(Colors.me)

      // load hi page if nothing selected
      if (!selectedTopic) {
        history.push(pages.find(page => page.name === 'Hi').path)
      }
      setTimeout(() => {
        setAnimationsComplete(true)
        setShowSentence(true)
      }, 500)
      setAnimationsCompleting(true)
    }, times.end)
  }

  const animations = createAnimations(currentColor)

  const [, setScrollPos] = useSpring(() => ({
    immediate: false,
    y: 0,
    onFrame: props => {
      if (profileRef.current) {
        profileRef.current.scrollTop = props.y
      }
    },
    config: config.default
  }))

  const onSelection = (topicName) => {
    if (topicName !== selectedTopic) {
      setScrollPos({
        y: 0,
        reset: true,
        from: { y: profileRef.current.scrollTop }
      })
    }
    history.push(pages.find(page => page.name === topicName).path)
  }

  const animationSize = isSmall ? 25 : 80

  return {
    visibleItems,
    animations,
    onBlockComplete,
    selectedTopic,
    onSelection,
    pages,
    animationsComplete,
    animationsCompleting,
    topicSentence,
    showSentence,
    profileRef,
    animationSize,
    isSmall,
    shouldNotAnimate,
  }
}
