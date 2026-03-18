import { PhotoCard } from "@/components/photo-card";
import { SectionHeading } from "@/components/section-heading";
import { getPortfolioData, getSeriesSummary } from "@/lib/portfolio";

function formatShootDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

export default async function HomePage() {
  const { photos, dataSource, debug } = await getPortfolioData();
  const featuredPhotos = photos.filter((photo) => photo.featured).slice(0, 4);
  const galleryPhotos = (featuredPhotos.length ? featuredPhotos : photos).slice(0, 6);
  const series = getSeriesSummary(photos).slice(0, 4);
  const latestPhoto = photos[0];

  return (
    <main className="pageShell">
      <div className="pageGlow pageGlowLeft" />
      <div className="pageGlow pageGlowRight" />

      <header className="hero">
        <nav className="topNav">
          <span className="brand">LIU / PHOTOGRAPHY</span>
          <div className="navLinks">
            <a href="#work">作品</a>
            <a href="#story">叙事</a>
            <a href="#contact">联系</a>
          </div>
        </nav>

        <section className="heroGrid">
          <div className="heroCopy">
            <span className="eyebrow">Cinematic Frames / Personal Archive</span>
            <h1>用光线、空间和停顿，整理我拍到的世界。</h1>
            <p>
              这个站点适合展示你的摄影系列、单张精选和拍摄笔记。数据默认从
              Supabase 读取；如果你还没接入数据库，页面也会先用示例内容正常展示。
            </p>

            <div className="heroActions">
              <a className="primaryButton" href="#work">
                浏览精选作品
              </a>
              <a className="secondaryButton" href="#contact">
                预约合作拍摄
              </a>
            </div>

            <div className="heroMeta">
              <div>
                <strong>{photos.length}</strong>
                <span>已展示作品</span>
              </div>
              <div>
                <strong>{series.length}</strong>
                <span>系列归档</span>
              </div>
              <div>
                <strong>{dataSource === "supabase" ? "Live" : "Demo"}</strong>
                <span>数据来源</span>
              </div>
            </div>
          </div>

          <div className="heroPanel">
            <span className="panelLabel">Latest Frame</span>
            <h2>{latestPhoto?.title ?? "Your Next Story"}</h2>
            <p>{latestPhoto?.description ?? "在这里放最新一组作品的开场说明。"}</p>
            <dl>
              <div>
                <dt>Series</dt>
                <dd>{latestPhoto?.series ?? "New Series"}</dd>
              </div>
              <div>
                <dt>Shot</dt>
                <dd>{latestPhoto ? formatShootDate(latestPhoto.shotOn) : "待更新"}</dd>
              </div>
              <div>
                <dt>Gear</dt>
                <dd>{latestPhoto ? `${latestPhoto.camera} / ${latestPhoto.lens}` : "待配置"}</dd>
              </div>
            </dl>
          </div>
        </section>
      </header>

      <section id="work" className="contentSection">
        <SectionHeading
          eyebrow="Selected Work"
          title="精选作品"
          description="首页默认优先展示 featured 作品；你可以在 Supabase 里按 sort_order 和 featured 自由调整排序。"
        />

        <div className="debugCard">
          <strong>当前图片读取状态</strong>
          <p>
            dataSource: {dataSource} | hasSupabaseEnv: {String(debug.hasSupabaseEnv)} | hasBucketEnv:{" "}
            {String(debug.hasBucketEnv)} | bucket: {debug.bucket ?? "missing"} | rows: {debug.fetchedRowCount}
          </p>
          <p>first image_path: {debug.firstImagePath ?? "none"}</p>
          <p>first image_url: {debug.firstResolvedImageUrl ?? "none"}</p>
          {debug.queryError ? <p>query error: {debug.queryError}</p> : null}
        </div>

        <div className="photoGrid">
          {galleryPhotos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} priority={index < 2} />
          ))}
        </div>
      </section>

      <section id="story" className="contentSection splitSection">
        <div className="storyPanel">
          <SectionHeading
            eyebrow="Series"
            title="系列叙事"
            description="适合把你的作品按照地点、主题、情绪或长期项目来组织。"
          />

          <div className="seriesList">
            {series.map((item) => (
              <article key={item.name} className="seriesCard">
                <strong>{item.name}</strong>
                <span>{item.count} 张作品</span>
              </article>
            ))}
          </div>
        </div>

        <div className="storyPanel notesPanel">
          <SectionHeading
            eyebrow="Approach"
            title="页面结构建议"
            description="这个模板已经把摄影站最常见的展示信息预留好了。"
          />

          <div className="noteList">
            <article>
              <strong>首页主视觉</strong>
              <p>用一句简短的创作陈述开场，再配一张最新或最有代表性的作品。</p>
            </article>
            <article>
              <strong>作品信息</strong>
              <p>每张卡片都能承载标题、地点、器材、镜头和简短说明，便于做作品归档。</p>
            </article>
            <article>
              <strong>Supabase 管理</strong>
              <p>你后续只需要在表里新增照片记录、设置图片路径，页面就会自动更新。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="contentSection manifestoSection">
        <div className="manifestoCard">
          <span className="eyebrow">Manifesto</span>
          <p>
            我偏好拍摄那些靠近沉默的瞬间: 风进入房间之前、街道刚刚下过雨之后、人物还没有意识到自己被注视的时候。
          </p>
        </div>
        <div className="manifestoCard">
          <span className="eyebrow">How To Extend</span>
          <p>
            后续你可以继续增加“关于我”、“服务报价”、“联系表单”或“博客/拍摄日志”页面，继续扩成完整个人品牌网站。
          </p>
        </div>
      </section>

      <section id="contact" className="contentSection contactSection">
        <SectionHeading
          eyebrow="Contact"
          title="让作品集变成你的线上名片"
          description="把邮箱、微信、Instagram 或小红书链接接上之后，这个站点就可以直接对外展示。"
        />

        <div className="contactCard">
          <p>
            数据接入完成后，把项目推到 GitHub，再导入到 Vercel，就能用自定义域名在线访问。
          </p>
          <a className="primaryButton" href="https://vercel.com/new" target="_blank" rel="noreferrer">
            前往 Vercel 部署
          </a>
        </div>
      </section>
    </main>
  );
}
