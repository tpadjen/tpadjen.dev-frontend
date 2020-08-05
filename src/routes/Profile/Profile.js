import React from 'react'
import './Profile.css'
import BlockBackground from '../../components/animations/BlockBackground'
import JumpIn from '../../components/animations/JumpIn'
import FlipIn from '../../components/animations/FlipIn'
import { Colors } from '../../theme'
import TextAnimator from '../../components/animations/TextAnimator'
import Sidebar from './components/Sidebar/Sidebar'
import FadeInOut from '../../components/animations/FadeInOut'
import Sticky, { useStickyElementListener } from '../../components/Sticky/Sticky'
const StickySidebar = Sticky(Sidebar)
import { useManageProfile } from './useManageProfile'
import withMustHaveUser from '../../auth/withMustHaveUser'
import TopicRoutes from './Topics/TopicRoutes'
import UserPage from '../UserPage'
import Menu from './components/Menu/Menu'


function Profile() {
  const {
    visibleItems,
    animations,
    onBlockComplete,
    selectedTopic,
    onSelection,
    pages,
    animationsCompleting,
    animationsComplete,
    topicSentence,
    showSentence,
    profileRef,
    animationSize,
    isSmall,
    shouldNotAnimate,
  } = useManageProfile()
  const { isSticky, stickyRef, handleScroll } = useStickyElementListener()


  return (
    <UserPage
      className="Profile UserPage"
      onScroll={handleScroll}
      style={{
        overflowY: animationsCompleting || animationsComplete ? 'scroll' : 'auto'
      }}
      ref={profileRef}
    >
      <BlockBackground
        springConfig={{ mass: 0.05, friction: 7 }}
        isSmall={isSmall}
        onComplete={onBlockComplete}
        shouldNotAnimate={shouldNotAnimate}
      >
        {shouldNotAnimate ? (
          <>
            <TextAnimator
              type={JumpIn}
              color={Colors.hi}
              animations={animations.welcome}
              size={animationSize}
              trailSpringConfig={{mass: 0, tension: 200, friction: 0 }}
            />
            {showSentence &&
              <FadeInOut itemKey={topicSentence ? selectedTopic : ''}>
                <div className='topicSentence'>{topicSentence || ''}</div>
              </FadeInOut>
            }
          </>
        ) : (
          <>
            <TextAnimator
              type={JumpIn}
              color={Colors.hi}
              animations={animations.welcome}
              size={animationSize}
            />
            {!animationsComplete && (
              <div className={`topicSentence${animationsCompleting ? ' fade' : ''}`}>
                <TextAnimator
                  type={JumpIn}
                  color={Colors.hi}
                  animations={animations.topicsI}
                  size={animationSize}
                />
                <TextAnimator
                  type={FlipIn}
                  replace={true}
                  animations={animations.topics}
                />
                <TextAnimator
                  type={FlipIn}
                  replace={true}
                  animations={animations.icons}
                />
              </div>
            )}
            {showSentence &&
              <FadeInOut itemKey={selectedTopic}>
                <div className='topicSentence'>{topicSentence}</div>
              </FadeInOut>
            }
          </>
        )}
        <Menu />
      </BlockBackground>
      <StickySidebar
        visibleItems={visibleItems}
        items={pages}
        selected={selectedTopic}
        onSelection={onSelection}
        isSticky={isSticky}
        ref={stickyRef}
        stickyStyle={{ height: '100%', zIndex: 998 }}
      />
      <main className="topic" style={{ color: Colors.text }}>
        <TopicRoutes pages={pages} />
      </main>
    </UserPage>
  )
}

export default withMustHaveUser(Profile)
