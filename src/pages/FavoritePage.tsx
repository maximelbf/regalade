import Header from "../components/Header";

type FavoritePageProps = {
    isLoggedIn: boolean;
    onLoginToggle: () => void;
}

export default function FavoritePage({ isLoggedIn, onLoginToggle }: FavoritePageProps) {
    return (
        <div>
            <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />
        </div>
    )
}