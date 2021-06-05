
import MenuArea from '../../MenuArea'
import ResentChat from '../../ResentChat'
import ChatInfo from '../../ChatInfo'

const HomeScreen = () => {
    return (
        <section className="home_page">
            <section className="main">
                <MenuArea />
                <ResentChat />
                <ChatInfo />
            </section>
        </section>
    )
}

export default HomeScreen