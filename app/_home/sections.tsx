import { YouTubeIcon } from "../brand";
import { FlapWord } from "./flap-word";

/** The pitch above the link maker. */
export function Hero() {
  return (
    <section className="hero">
      <YouTubeIcon width={56} />
      <h1>
        Your bio link is losing you <FlapWord />.
      </h1>
      <p className="lede">
        Instagram and TikTok open YouTube links in their own browser, where
        viewers aren&apos;t signed in. Tap Subscribe and YouTube asks them to
        sign in first. Many just scroll on.
      </p>
      <p className="value">
        ytopen sends every click straight to the YouTube app, where
        viewers are already signed in. Subscribing, liking and commenting
        take one tap.
      </p>
    </section>
  );
}

/** Everything below the link maker: the comparison, the steps and the footer. */
export function Explainer() {
  return (
    <>
      <section className="block">
        <h2>Open the app, not a browser</h2>
        <div>
          <p>
            Same video, same viewer. The only difference is where the link
            opens.
          </p>
          <div className="compare">
            <div className="compare-col before">
              <h3>A regular YouTube link</h3>
              <ul>
                <li>Opens in the Instagram or TikTok browser</li>
                <li>Viewer is signed out</li>
                <li>Subscribing means signing in first</li>
              </ul>
            </div>
            <div className="compare-col after">
              <h3>
                <YouTubeIcon width={20} />A ytopen link
              </h3>
              <ul>
                <li>Opens in the YouTube app</li>
                <li>Viewer is already signed in</li>
                <li>Subscribing takes one tap</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <h2>How it works</h2>
        <div>
          <ol className="steps">
            <li>Paste a link to a video, Short, live stream or channel.</li>
            <li>Copy your new link, or download it as a QR code.</li>
            <li>Share it in your bio, stories, captions, DMs and print.</li>
          </ol>
          <p className="fine">
            No YouTube app? The link opens youtube.com instead, so it always
            works.
          </p>
        </div>
      </section>

      <footer>
        <p>
          Free to use. Links don&apos;t track viewers unless you turn on click
          tracking, and even then only totals are kept.
        </p>
        <p>ytopen isn&apos;t affiliated with YouTube or Google.</p>
      </footer>
    </>
  );
}
