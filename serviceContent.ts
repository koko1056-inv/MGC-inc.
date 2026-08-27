// サービスページ（AI営業 / AI電話 / Salesforce AI）の本文。
// App.tsx の ServiceView がこのデータを読んでページを組み立てる。
// セクションは type ごとに見せ方が変わるため、サービスごとに構成を変えて差別化する。

export type ServiceKey = 'ai-sales' | 'ai-phone' | 'salesforce-ai';

export type ServiceSection =
  | { type: 'problems'; eyebrow: string; heading: string; lead?: string; items: string[] }
  | { type: 'steps'; eyebrow: string; heading: string; lead?: string; note?: string; steps: { no: string; title: string; desc: string }[] }
  | { type: 'compare'; eyebrow: string; heading: string; lead?: string; leftLabel: string; rightLabel: string; rows: { axis: string; left: string; right: string }[] }
  | { type: 'split'; eyebrow: string; heading: string; lead?: string; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[] }
  | { type: 'chat'; eyebrow: string; heading: string; lead?: string; note?: string; turns: { who: 'ai' | 'caller'; text: string }[] }
  | { type: 'layers'; eyebrow: string; heading: string; lead?: string; layers: { stage: string; title: string; desc: string; examples: string[] }[] }
  | { type: 'cards'; eyebrow: string; heading: string; lead?: string; cards: { title: string; desc: string }[] }
  | { type: 'notes'; eyebrow: string; heading: string; lead?: string; items: string[] }
  | { type: 'faq'; eyebrow: string; heading: string; items: { q: string; a: string }[] };

export type ServicePage = {
  slug: ServiceKey;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  hero: { badge: string; title: string; titleSub: string; lead: string; points: string[] };
  sections: ServiceSection[];
  cta: { heading: string; lead: string; button: string; sub: string };
};

type Content = Record<'ja' | 'en', Record<ServiceKey, ServicePage>>;

export const serviceContent: Content = {
  ja: {
    // ────────────────────────────────────────────────────────────
    'ai-sales': {
      slug: 'ai-sales',
      navLabel: 'AI営業',
      seoTitle: 'AI営業サービス｜アポイント獲得までをAIに任せる - ＭＧＣ株式会社',
      seoDescription: 'リスト作成から初回接触・返信対応・日程調整まで、営業の前工程をAIが担います。人が商談に集中できる状態をつくる、AI営業サービス。',
      image: '/assets/service/ai-sales.png',
      imageAlt: '多数の見込み客リストがAIによって絞り込まれ、1件の商談につながる流れを表した図',
      hero: {
        badge: 'AI Sales',
        title: 'アポイントが取れるまでを、AIに任せる。',
        titleSub: '― 営業の前工程を、人から外す ―',
        lead: '営業の時間の多くは、商談ではなく「商談にたどり着くまで」に溶けています。リストを作り、文面を考え、送り、返信を捌き、日程を調整する。この前工程をAIが担い、人は商談と提案に集中する。それがMGCのAI営業サービスです。',
        points: ['リスト作成から日程調整まで', '送信文面は1社ずつ個別生成', '人の確認を挟む設計'],
      },
      sections: [
        {
          type: 'problems',
          eyebrow: 'Problem',
          heading: 'よくある詰まり方',
          lead: '「営業を強化したい」という相談の中身は、たいてい次のどれかです。',
          items: [
            '商談の前工程（リスト作成・初回接触・追客）に時間を取られ、既存顧客への提案が薄くなっている',
            'リストが枯渇し、同じ企業に何度も接触してしまっている',
            '担当者ごとにやり方が違い、成果が属人化している。辞めると再現できない',
            '外注のテレアポは費用がかさむわりに、質の合わないアポが混ざる',
            '一斉送信は開封されない。かといって1社ずつ書く時間はない',
          ],
        },
        {
          type: 'steps',
          eyebrow: 'How it works',
          heading: '5つの工程を、AIが順に処理する',
          lead: '営業の前工程を分解し、それぞれをAIに担わせます。すべてを自動で流しきるのではなく、精度が要る箇所には人の確認を挟みます。',
          note: '実際にどこまでAIに任せ、どこから人が見るかは、扱う商材と単価によって変えます。単価の高い商材ほど、人の確認を厚くします。',
          steps: [
            { no: '01', title: 'ターゲットの定義', desc: '受注につながった既存顧客の共通点から、狙うべき企業の条件を言語化します。業種・規模・使っているツール・組織の状態など、実際に効いている軸を洗い出します。' },
            { no: '02', title: 'リストの生成と重複排除', desc: '条件に合う企業を収集し、過去の接触履歴・既存顧客・取引先と突き合わせて除外します。同じ企業に重ねて当たる事故を、仕組みで防ぎます。' },
            { no: '03', title: '文面の個別生成', desc: '1社ずつ、その企業の事業内容や公開情報を踏まえた文面をAIが作ります。テンプレートの差し込みではなく、書き出しと提案の切り口を企業ごとに変えます。' },
            { no: '04', title: '送信と追客', desc: '送信し、反応に応じて追いかけます。開封・クリック・返信の状況を見て、次に何をするかを判断します。反応のない相手を機械的に何度も追わない設計にします。' },
            { no: '05', title: '返信対応と日程調整', desc: '返信内容を分類し、日程調整まで進めます。温度の高い返信・条件の擦り合わせが要る返信は、人にすぐ引き渡します。' },
          ],
        },
        {
          type: 'split',
          eyebrow: 'Division of labor',
          heading: 'AIに任せること、人が持つこと',
          lead: 'AI営業がうまくいかない一番の原因は、線引きをせずに全部を自動化しようとすることです。最初にここを決めます。',
          leftTitle: 'AIが担う',
          leftItems: [
            '条件に合う企業の収集と、重複・既存顧客の除外',
            '1社ずつの文面生成と、送信タイミングの判断',
            '反応の記録と、追客するかどうかの判定',
            '返信内容の分類と、一次返信の下書き',
            '日程調整とカレンダー登録',
          ],
          rightTitle: '人が持つ',
          rightItems: [
            '狙う市場と、外す市場を決めること',
            '「この文面を自社として送ってよいか」の最終判断',
            '温度の高い返信への対応と、条件の擦り合わせ',
            '商談そのものと、提案内容の設計',
            '断られた理由を読み、狙いを修正すること',
          ],
        },
        {
          type: 'cards',
          eyebrow: 'Why MGC',
          heading: 'ツールを売るのではなく、運用ごと引き受ける',
          lead: 'ツールを導入しても、設定と改善を回す人がいなければ止まります。MGCは仕組みを作り、動かし続けるところまでを担当します。',
          cards: [
            { title: '自社で使っているものを渡す', desc: 'MGCは自社の営業でも同じ仕組みを使っています。机上の設計ではなく、自分たちで運用して詰まった箇所を踏まえた形でお渡しします。' },
            { title: '特定のツールに縛られない', desc: '特定のSaaSの代理店ではないため、既存のCRMやメール環境に合わせて構成を選べます。今使っているものを捨てる前提にしません。' },
            { title: '内製化まで見据える', desc: '運用を続けるうちに、社内で回したいという話になります。そのときに引き継げるよう、判断基準と手順を文書に残しながら進めます。' },
            { title: '成果の定義から決める', desc: '「アポ数」だけを追うと、商談にならないアポが増えます。何をもって成功とするかを最初に決め、その指標で運用を調整します。' },
          ],
        },
        {
          type: 'notes',
          eyebrow: 'Notes',
          heading: '先にお伝えしていること',
          lead: '導入前に必ず確認いただく点です。',
          items: [
            '送信先の取得方法と送信内容は、特定電子メール法をはじめとする関連法令の範囲内で設計します。無差別な大量送信は行いません。',
            '立ち上がりには時間がかかります。最初の数週間は反応を見ながら文面と条件を調整する期間で、ここを飛ばすと精度が上がりません。',
            'AIが生成した文面をそのまま無確認で送る運用は、原則としておすすめしていません。少なくとも初期は人が目を通す形で始めます。',
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'よくあるご質問',
          items: [
            { q: '今のCRM（Salesforce・kintoneなど）と連携できますか？', a: '可能です。既存のCRMに接触履歴と返信結果を書き戻す形で構成することが多く、営業担当が普段見ている画面を変えずに済みます。APIが用意されていないツールの場合は、連携方法を含めて最初にご相談します。' },
            { q: 'どのくらいの期間で成果が見えますか？', a: '商材と単価によりますが、反応の傾向が見えてくるまでに数週間、そこから条件と文面を調整する期間が必要です。初月から安定した数字が出る前提では設計していません。まず何を測るかを決め、そこに向けて調整していく進め方をとります。' },
            { q: '自社の営業担当が不要になりますか？', a: 'なりません。この仕組みが担うのは商談にたどり着くまでの工程で、商談そのものと提案は人の仕事です。むしろ営業担当が前工程から解放され、商談に時間を使える状態をつくることが目的です。' },
            { q: 'まず小さく試せますか？', a: '可能です。対象を1つのセグメントに絞って始め、反応を見てから広げる進め方をおすすめしています。最初から全方位に広げると、どの条件が効いたのか分からなくなります。' },
          ],
        },
      ],
      cta: {
        heading: '営業の前工程、どこから外せるか見てみませんか',
        lead: '今の営業の流れを伺い、どの工程をAIに任せられるか、どこは人が持つべきかを整理してお返しします。初回のご相談は無料です。',
        button: '無料で相談する',
        sub: '3分のAI活用診断で、先に当たりをつけることもできます。',
      },
    },

    // ────────────────────────────────────────────────────────────
    'ai-phone': {
      slug: 'ai-phone',
      navLabel: 'AI電話',
      seoTitle: 'AI電話（音声AI）｜電話の一次対応を自動化 - ＭＧＣ株式会社',
      seoDescription: '鳴り続ける電話の一次対応を音声AIが引き受けます。プッシュ操作のIVRとは違い、用件を話し言葉のまま聞き取り、要約して担当者に渡します。',
      image: '/assets/service/ai-phone.png',
      imageAlt: '受話器から広がる音声波形を表した、音声AIによる電話対応のイメージ図',
      hero: {
        badge: 'Voice AI',
        title: '鳴り続ける電話を、AIが最初に受ける。',
        titleSub: '― 用件を聞き取り、要約して、人に渡す ―',
        lead: '電話は、かかってきた瞬間に人の手を止めます。件数が多いほど、本来の業務が進みません。音声AIが一次対応を引き受け、用件を聞き取って要約し、人が対応すべきものだけを引き渡します。',
        points: ['24時間・同時に何本でも', '話し言葉のまま聞き取る', '要約と録音が全件残る'],
      },
      sections: [
        {
          type: 'compare',
          eyebrow: 'Difference',
          heading: '従来のIVRと、何が違うのか',
          lead: '「1を押してください」の自動音声は以前からありました。音声AIが変えたのは、かけてきた人が操作を覚えなくてよくなったことです。',
          leftLabel: '従来のIVR（プッシュ操作）',
          rightLabel: '音声AI',
          rows: [
            { axis: '用件の伝え方', left: '番号を選んで階層をたどる。該当する番号がないと詰まる', right: '話し言葉のまま伝えられる。「先週の注文の件で」で通じる' },
            { axis: '一度に扱える情報', left: '1階層で1つ。日時と用件を同時には受け取れない', right: '用件・日時・名前・電話番号をまとめて聞き取れる' },
            { axis: '分岐の変更', left: '音声の録り直しと設定変更が必要で、動きが重い', right: '対応方針の記述を変えるだけで反映できる' },
            { axis: '記録の残り方', left: 'どの番号を押したかだけが残る', right: '会話内容の要約・録音・抽出項目が全件残る' },
            { axis: 'かけた人の体感', left: '階層をたどる間に切られやすい', right: '人が出たときに近い流れで用件を伝えられる' },
          ],
        },
        {
          type: 'chat',
          eyebrow: 'Example',
          heading: '実際のやりとりのイメージ',
          lead: '折り返しの予約を受ける場合の例です。用件・希望日時・連絡先を一度の会話で受け取り、担当者には要約が届きます。',
          note: 'この例は動作イメージであり、実際の応答内容は業務に合わせて設計します。話し方・聞き返しの粘り・人に回す条件は、すべて調整できます。',
          turns: [
            { who: 'ai', text: 'お電話ありがとうございます。ご用件をお話しください。' },
            { who: 'caller', text: '先週注文した部品の納期を確認したいんですが、担当の方いますか。' },
            { who: 'ai', text: '納期のご確認ですね。担当者におつなぎしますが、ただいま席を外しております。折り返しのお電話でもよろしいでしょうか。' },
            { who: 'caller', text: 'はい、それで大丈夫です。' },
            { who: 'ai', text: 'ありがとうございます。ご希望のお時間はございますか。' },
            { who: 'caller', text: '今日の夕方、17時以降だと助かります。' },
            { who: 'ai', text: '本日17時以降ですね。お名前とご連絡先をお願いします。' },
          ],
        },
        {
          type: 'split',
          eyebrow: 'Division of labor',
          heading: 'AIが受ける電話、人に回す電話',
          lead: '全部をAIに受けさせようとすると、かけてきた相手を不快にさせます。最初に線を引きます。',
          leftTitle: 'AIが受ける',
          leftItems: [
            '営業時間・場所・在庫などの定型的な問い合わせ',
            '折り返し予約の受付（用件・希望時間・連絡先の聞き取り）',
            '予約の受付・変更・キャンセル',
            '担当部署の振り分けと取り次ぎ',
            '営業時間外・混雑時のあふれ呼',
          ],
          rightTitle: 'すぐ人に回す',
          rightItems: [
            'クレーム・苦情と判断されたもの',
            '緊急性が高い、または安全に関わる用件',
            '金額・契約条件の交渉が絡むもの',
            'AIが2回聞き返しても要件を掴めなかったもの',
            'かけてきた方が「人に代わってほしい」と言ったとき',
          ],
        },
        {
          type: 'steps',
          eyebrow: 'Process',
          heading: '導入の進め方',
          lead: 'いきなり全件をAIに向けることはしません。影響の小さい範囲から始めて、実際の通話を見ながら広げます。',
          steps: [
            { no: '01', title: '現状の通話を分解する', desc: '何の用件が、どの時間帯に、何件かかってきているかを整理します。ここでAI化して効く範囲が決まります。' },
            { no: '02', title: '応答の設計', desc: '受け答えの方針、聞き取る項目、人に回す条件を決めます。ここが品質のほぼすべてを決める工程です。' },
            { no: '03', title: '限定運用', desc: '時間外のみ、あるいは特定の番号のみで開始します。実際の通話を毎日確認し、噛み合わなかった会話を洗い出します。' },
            { no: '04', title: '調整と拡大', desc: '聞き返しの粘り、人に回す条件、言い回しを調整し、対象を広げます。うまくいかない用件は無理にAIに残しません。' },
          ],
        },
        {
          type: 'notes',
          eyebrow: 'Notes',
          heading: '導入前に決めておくこと',
          lead: '技術より先に、運用ルールとして決めておく必要がある項目です。ここを曖昧にしたまま始めると、後から止まります。',
          items: [
            'AIが応答していることを、かけてきた方にどう伝えるか。MGCは冒頭で明示する運用を標準としています。',
            '通話の録音と、その保存期間・利用範囲をどう案内するか。個人情報の取り扱いに関わります。',
            '人に引き渡す条件と、引き渡し先が不在だったときの扱い。ここが決まっていないと、たらい回しが起きます。',
            'AIが対応しきれなかった場合の最終的な受け皿。「結局つながらない」状態を作らないための設計です。',
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'よくあるご質問',
          items: [
            { q: '今使っている電話番号のまま導入できますか？', a: '多くの場合、番号を変えずに導入できます。現在お使いの回線の種類と契約内容によって方法が変わるため、初回のご相談で構成を確認します。既存の電話機を残したまま、あふれ呼だけをAIに向ける構成も可能です。' },
            { q: '方言や早口でも聞き取れますか？', a: '一般的な会話であれば実用的な精度で聞き取れますが、100%ではありません。だからこそ「2回聞き返しても掴めなければ人に回す」といった逃げ道を必ず設計に入れます。聞き取れないことを前提にした設計にするかどうかで、実運用の満足度が変わります。' },
            { q: '対応履歴はどこで確認できますか？', a: '通話ごとに、要約・抽出した項目・録音を残します。既存のCRMやチャットツールへ流し込むこともできるため、担当者が普段見ている場所に通知を届ける形にできます。' },
            { q: '結局、電話に出る人は不要になりますか？', a: 'なりません。AIが引き受けるのは一次対応で、判断や交渉が要る電話は人に渡ります。目的は人を減らすことではなく、定型的な電話で作業が中断される状態をなくすことです。' },
          ],
        },
      ],
      cta: {
        heading: 'まず、どの電話をAIに向けられるか整理しませんか',
        lead: '現在の着信内容と件数を伺い、AIで受けられる範囲と、人に残すべき範囲を切り分けてご提案します。初回のご相談は無料です。',
        button: '無料で相談する',
        sub: '通話内容の傾向が分かる資料があれば、より具体的にお返しできます。',
      },
    },

    // ────────────────────────────────────────────────────────────
    'salesforce-ai': {
      slug: 'salesforce-ai',
      navLabel: 'Salesforce AI',
      seoTitle: 'Salesforce AI活用支援｜入力する箱から、動く仕組みへ - ＭＧＣ株式会社',
      seoDescription: 'Salesforceを「入力する箱」で終わらせないためのAI活用支援。入力の自動化、示唆の提示、エージェントによる実行まで、標準機能で足りるかの判断から支援します。',
      image: '/assets/service/salesforce-ai.png',
      imageAlt: 'CRMのデータ層が積み重なり、上位の層へ流れていく様子を表した図',
      hero: {
        badge: 'Salesforce × AI',
        title: '「入力する箱」を、動く仕組みに変える。',
        titleSub: '― 貯めたデータに、仕事をさせる ―',
        lead: 'Salesforceは導入したが、入力が追いつかず、レポートも見られていない。よくある状態です。AIは、この詰まりを2方向から解きます。入力の負担を下げることと、貯まったデータから次の打ち手を出すこと。MGCはその設計と実装を支援します。',
        points: ['入力を減らす', 'データから示唆を出す', '標準機能で足りるかから判断'],
      },
      sections: [
        {
          type: 'problems',
          eyebrow: 'Problem',
          heading: 'こうなっていませんか',
          lead: 'Salesforceが定着しないとき、原因はたいていツールではなく、入力と活用の非対称にあります。',
          items: [
            '入力が営業担当の負担になっていて、商談後の記録が数日遅れる、または埋まらない',
            '項目は埋まっているが、内容が「訪問」「検討中」ばかりで後から使えない',
            'レポートは作ったが、誰も見ていない。会議では結局それぞれのExcelが出てくる',
            '過去に似た案件があったはずなのに、探せないので毎回ゼロから提案を作っている',
            'Agentforce や Einstein を勧められたが、自社に必要なのか判断できない',
          ],
        },
        {
          type: 'layers',
          eyebrow: 'Approach',
          heading: '3つの段階で考える',
          lead: '一気に「AIエージェントが自律的に動く」状態を目指すと、まず失敗します。土台から順に積みます。下の段が埋まっていないと、上の段は機能しません。',
          layers: [
            {
              stage: 'STAGE 1',
              title: '入力を減らす',
              desc: '人が手で打つ量を減らします。ここを飛ばして分析に進んでも、元のデータが薄いため何も出ません。最初に必ず取り組む段階です。',
              examples: [
                '商談後の音声メモから、活動記録の下書きを自動生成する',
                'メールのやりとりから、次のアクションと期日を抽出して登録する',
                '名刺・問い合わせフォームからのリード登録と重複チェックを自動化する',
              ],
            },
            {
              stage: 'STAGE 2',
              title: '示唆を出す',
              desc: '貯まったデータから、人が気づいていない傾向を出します。「見に行かないと分からない」レポートではなく、必要なときに向こうから届く形にします。',
              examples: [
                '受注・失注の傾向から、確度の高い案件の特徴を言語化する',
                '停滞している商談を検知し、担当者に理由の候補とともに通知する',
                '過去の類似案件と、そのとき使った提案資料を検索できるようにする',
              ],
            },
            {
              stage: 'STAGE 3',
              title: 'エージェントが動く',
              desc: '示唆を出すだけでなく、AIが実際に処理を進めます。ここまで来て初めて、Agentforce のようなエージェント基盤が意味を持ちます。',
              examples: [
                '問い合わせの一次回答を作成し、担当者の承認を経て返信する',
                '条件を満たした案件のフォローアップを自動で起票・実行する',
                '見積の下書きを過去案件から生成し、人が確認して確定する',
              ],
            },
          ],
        },
        {
          type: 'compare',
          eyebrow: 'Judgement',
          heading: '標準機能で足りるか、作るべきか',
          lead: 'Salesforce の標準AI機能（Einstein / Agentforce）で足りるなら、それが最短です。MGCは作ることを前提にせず、まずここを判断します。',
          leftLabel: '標準機能で進めたほうがよい',
          rightLabel: '個別に作る価値がある',
          rows: [
            { axis: '業務の形', left: '一般的な営業プロセスに沿っている', right: '自社独自の商習慣・承認フローが強く効いている' },
            { axis: '扱うデータ', left: 'Salesforce の中でほぼ完結する', right: '基幹システム・Excel・外部SaaSにまたがる' },
            { axis: '必要な精度', left: '参考値として使えれば十分', right: '判断の根拠になるため、精度と説明が要る' },
            { axis: 'ライセンス', left: '対象ユーザーが限られ、費用が見合う', right: '全社に配ると費用が跳ねる、または対象外の利用が多い' },
            { axis: '立ち上がり', left: '早く始めることを優先したい', right: '時間をかけても自社に合った形にしたい' },
          ],
        },
        {
          type: 'cards',
          eyebrow: 'Why MGC',
          heading: 'ライセンスを売る立場ではないこと',
          lead: 'MGCはSalesforceの再販を目的としていません。そのため、標準機能で足りる場合は素直にそう申し上げます。',
          cards: [
            { title: '要否の判断から入る', desc: '「AIを入れる前提」で話を始めません。今の詰まりが入力設計や運用ルールの問題であれば、AI以外の解決策を先に提案します。' },
            { title: '外部システムとつなぐ', desc: '実務のデータはSalesforceの外にも散らばっています。基幹システムやExcel、他のSaaSを含めて、どこを正とするかから設計します。' },
            { title: '現場が使う形にする', desc: '管理側だけが便利な仕組みは入力されません。入力する人の手数が実際に減っているかを基準に、設計を判断します。' },
            { title: '運用を残す', desc: '作った後に誰も手を入れられない状態を避けるため、判断基準と手順を残しながら進めます。運用の引き継ぎまでを想定します。' },
          ],
        },
        {
          type: 'steps',
          eyebrow: 'Process',
          heading: '進め方',
          lead: '現状の使われ方を見るところから始めます。設定画面だけでなく、実際に入っているデータを見せていただきます。',
          steps: [
            { no: '01', title: '現状把握', desc: '項目の埋まり方、入力までの時間、実際に見られているレポートを確認します。ここで詰まりの本当の原因が分かります。' },
            { no: '02', title: '対象の決定', desc: '効果が出て、かつ検証しやすい業務を1つ選びます。全社展開は最初に狙いません。' },
            { no: '03', title: '構成の判断', desc: '標準機能で足りるか、個別に作るかを判断します。費用とライセンスの見積もりもこの段階で出します。' },
            { no: '04', title: '実装と並走', desc: '一部のチームで先に使い、実際の入力データで精度を確認します。既存の運用は止めずに並走させます。' },
            { no: '05', title: '展開と定着', desc: '手順を文書化し、対象を広げます。運用を続けるための判断基準を社内に残します。' },
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'よくあるご質問',
          items: [
            { q: 'Agentforce や Einstein のライセンスは必要ですか？', a: '構成によります。標準のAI機能を使う場合は該当するライセンスが必要ですが、外部のAIをAPI経由で連携する構成なら不要なこともあります。どちらが費用と要件に合うかを、最初の判断として整理してお出しします。' },
            { q: 'Salesforce の中のデータを外部のAIに渡すことになりますか？', a: '構成によって変わります。データを外に出さない構成も、限定した範囲だけを渡す構成も可能です。どの情報がどこまで出るのかを明示したうえで、社内規程に合う形を選びます。ここを曖昧にしたまま進めることはしません。' },
            { q: '入力されていないデータが多いのですが、始められますか？', a: '始められますし、むしろそこが最初の対象になります。データが薄いまま分析に進んでも成果は出ないため、入力の負担を下げる段階（STAGE 1）から着手するのが一般的な進め方です。' },
            { q: 'kintone や他のCRMでも同じことはできますか？', a: '可能です。MGCはSalesforce専業ではなく、APIが用意されているCRMであれば同様の構成を組めます。現在お使いのツールを変える前提ではご提案しません。' },
          ],
        },
      ],
      cta: {
        heading: 'まず、今のSalesforceの使われ方を見せてください',
        lead: '実際に入っているデータと運用を確認し、AIで解ける詰まりと、そうでない詰まりを切り分けてご提案します。初回のご相談は無料です。',
        button: '無料で相談する',
        sub: '標準機能で足りる場合は、そのようにお伝えします。',
      },
    },
  },

  // ════════════════════════════════════════════════════════════
  en: {
    'ai-sales': {
      slug: 'ai-sales',
      navLabel: 'AI Sales',
      seoTitle: 'AI Sales Service | Let AI handle everything up to the meeting - MGC Inc.',
      seoDescription: 'From list building to first contact, follow-up and scheduling, AI handles the front end of sales so your people can focus on the conversations that matter.',
      image: '/assets/service/ai-sales.png',
      imageAlt: 'Diagram showing a large pool of prospects narrowing down to a single booked meeting',
      hero: {
        badge: 'AI Sales',
        title: 'Let AI handle everything up to the meeting.',
        titleSub: '— Take the front end of sales off your team —',
        lead: 'Most sales time disappears before the actual conversation: building lists, writing outreach, chasing replies, arranging times. AI takes on that front end so your people can focus on the meeting and the proposal.',
        points: ['From list building to scheduling', 'Every message written per company', 'Human review built in'],
      },
      sections: [
        {
          type: 'problems',
          eyebrow: 'Problem',
          heading: 'Where it usually gets stuck',
          lead: 'When companies say they want to strengthen sales, it is usually one of these.',
          items: [
            'The front end eats the week, so existing customers get thinner attention',
            'The list runs dry and the same companies get contacted twice',
            'Every rep works differently, so results live in individuals and leave with them',
            'Outsourced cold calling costs a lot and delivers meetings that do not fit',
            'Mass mail gets ignored, but nobody has time to write one message at a time',
          ],
        },
        {
          type: 'steps',
          eyebrow: 'How it works',
          heading: 'Five stages, handled in order',
          lead: 'We break the front end into stages and hand each to AI — with human checks wherever precision matters.',
          note: 'How much runs automatically depends on your deal size. The higher the value, the more human review we keep.',
          steps: [
            { no: '01', title: 'Define the target', desc: 'We work backwards from customers you actually won to describe the companies worth approaching — industry, size, tools in use, organisational signals.' },
            { no: '02', title: 'Build and de-duplicate', desc: 'We collect matching companies and screen them against past contacts, existing customers and partners, so nobody gets approached twice.' },
            { no: '03', title: 'Write per company', desc: 'AI drafts each message from that company’s business and public information — not a template with fields swapped, but a different angle per company.' },
            { no: '04', title: 'Send and follow up', desc: 'We send, then follow based on opens, clicks and replies — without mechanically chasing people who have shown no interest.' },
            { no: '05', title: 'Handle replies', desc: 'Replies are classified and taken through to a booked time. Warm replies and anything needing negotiation go straight to a person.' },
          ],
        },
        {
          type: 'split',
          eyebrow: 'Division of labor',
          heading: 'What AI does, what people keep',
          lead: 'The main reason AI sales fails is trying to automate everything without drawing this line first.',
          leftTitle: 'AI handles',
          leftItems: [
            'Collecting matching companies and screening out duplicates',
            'Writing each message and choosing when to send',
            'Recording responses and deciding whether to follow up',
            'Classifying replies and drafting first responses',
            'Scheduling and calendar booking',
          ],
          rightTitle: 'People keep',
          rightItems: [
            'Deciding which markets to pursue and which to skip',
            'The final call on whether a message goes out in your name',
            'Warm replies and any negotiation of terms',
            'The meeting itself and the proposal',
            'Reading why you lost, and adjusting the aim',
          ],
        },
        {
          type: 'cards',
          eyebrow: 'Why MGC',
          heading: 'We run it, not just sell it',
          lead: 'Tools stall without someone tuning them. We build the system and keep it running.',
          cards: [
            { title: 'We use it ourselves', desc: 'MGC runs the same system for its own sales, so what you get reflects the places we actually got stuck.' },
            { title: 'Not tied to one vendor', desc: 'We are not a reseller, so we fit the setup to your existing CRM and mail environment instead of replacing them.' },
            { title: 'Built to hand over', desc: 'Sooner or later you will want this in-house, so we document the decisions and procedures as we go.' },
            { title: 'Define success first', desc: 'Chasing meeting count alone produces meetings that go nowhere. We agree what counts as success, then tune to that.' },
          ],
        },
        {
          type: 'notes',
          eyebrow: 'Notes',
          heading: 'What we tell you upfront',
          lead: 'Points we confirm before starting.',
          items: [
            'How contacts are sourced and what is sent is designed to stay within Japan’s anti-spam legislation and related rules. We do not send indiscriminately at volume.',
            'It takes time to ramp. The first few weeks are for adjusting messaging and targeting; skipping that stage caps the results.',
            'We do not recommend sending AI-written messages with no human review, at least not in the early stages.',
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'Frequently asked questions',
          items: [
            { q: 'Can it connect to our CRM (Salesforce, kintone, etc.)?', a: 'Yes. We usually write contact history and replies back into your existing CRM so reps keep working in the screen they already use. Where no API exists, we discuss the approach upfront.' },
            { q: 'How soon do results appear?', a: 'It depends on your product and price point. Expect several weeks before response patterns emerge, then a period of tuning. We do not design around stable numbers in month one.' },
            { q: 'Does this replace our sales team?', a: 'No. It covers the work before the meeting. The meeting and the proposal stay with people — the point is to give them the time for it.' },
            { q: 'Can we start small?', a: 'Yes, and we recommend it. Start with one segment, see the response, then widen. Going broad immediately makes it impossible to tell what worked.' },
          ],
        },
      ],
      cta: {
        heading: 'Let’s see what can come off your team',
        lead: 'Tell us how sales runs today and we will map which stages AI can take and which should stay with people. The first consultation is free.',
        button: 'Book a free consultation',
        sub: 'Our 3-minute AI diagnosis can give you a first read.',
      },
    },

    'ai-phone': {
      slug: 'ai-phone',
      navLabel: 'Voice AI',
      seoTitle: 'Voice AI for phone handling | Automate first response - MGC Inc.',
      seoDescription: 'Voice AI answers your incoming calls, understands the request in natural speech, summarises it and passes on only what needs a person.',
      image: '/assets/service/ai-phone.png',
      imageAlt: 'Diagram of a handset with a voice waveform, representing AI-handled phone response',
      hero: {
        badge: 'Voice AI',
        title: 'Let AI answer the phone first.',
        titleSub: '— Understand the request, summarise it, pass it on —',
        lead: 'A ringing phone stops someone mid-task. Voice AI takes first response, captures the request in the caller’s own words, and hands over only the calls that need a person.',
        points: ['24/7, many calls at once', 'Natural speech, no menus', 'Summary and recording for every call'],
      },
      sections: [
        {
          type: 'compare',
          eyebrow: 'Difference',
          heading: 'How this differs from a traditional IVR',
          lead: '“Press 1” menus have existed for years. What changed is that the caller no longer has to learn your menu.',
          leftLabel: 'Traditional IVR',
          rightLabel: 'Voice AI',
          rows: [
            { axis: 'Stating the request', left: 'Navigate a menu; stuck if no option fits', right: 'Say it naturally — “about last week’s order” is enough' },
            { axis: 'Information per step', left: 'One choice at a time', right: 'Request, time, name and number captured together' },
            { axis: 'Changing the flow', left: 'Re-record audio and reconfigure', right: 'Update the written policy and it applies' },
            { axis: 'What gets recorded', left: 'Only which keys were pressed', right: 'Summary, recording and extracted fields for every call' },
            { axis: 'Caller experience', left: 'Many hang up while navigating', right: 'Close to speaking with a person' },
          ],
        },
        {
          type: 'chat',
          eyebrow: 'Example',
          heading: 'What a call sounds like',
          lead: 'Taking a callback request: the reason, preferred time and contact details are captured in one conversation, and the owner receives a summary.',
          note: 'This is an illustration. Wording, how hard it probes, and when it hands over are all designed around your operation.',
          turns: [
            { who: 'ai', text: 'Thank you for calling. How can I help?' },
            { who: 'caller', text: 'I want to check the delivery date on a part I ordered last week.' },
            { who: 'ai', text: 'A delivery date — of course. The person handling that is away from their desk. May we call you back?' },
            { who: 'caller', text: 'Yes, that works.' },
            { who: 'ai', text: 'Thank you. Is there a time that suits you?' },
            { who: 'caller', text: 'This evening, after five if possible.' },
            { who: 'ai', text: 'After five today. May I take your name and number?' },
          ],
        },
        {
          type: 'split',
          eyebrow: 'Division of labor',
          heading: 'What AI takes, what goes straight to a person',
          lead: 'Putting every call through AI frustrates callers. We draw the line first.',
          leftTitle: 'AI answers',
          leftItems: [
            'Routine questions — hours, location, stock',
            'Callback requests, capturing reason, time and contact',
            'Bookings, changes and cancellations',
            'Routing to the right team',
            'Out-of-hours and overflow calls',
          ],
          rightTitle: 'Straight to a person',
          rightItems: [
            'Anything identified as a complaint',
            'Urgent or safety-related calls',
            'Anything involving price or contract terms',
            'Calls where AI has asked twice and still cannot tell',
            'Whenever the caller asks for a person',
          ],
        },
        {
          type: 'steps',
          eyebrow: 'Process',
          heading: 'How we roll it out',
          lead: 'We never point every call at AI on day one. We start where the impact is small and widen while watching real calls.',
          steps: [
            { no: '01', title: 'Break down today’s calls', desc: 'What is being asked, when, and how often. This determines where AI actually helps.' },
            { no: '02', title: 'Design the responses', desc: 'How it answers, what it captures, and when it hands over. This stage decides almost all of the quality.' },
            { no: '03', title: 'Limited rollout', desc: 'Start out-of-hours or on one number. Review real calls daily and collect the ones that went wrong.' },
            { no: '04', title: 'Tune and widen', desc: 'Adjust probing, handover rules and phrasing, then widen. Call types that do not work are handed back to people.' },
          ],
        },
        {
          type: 'notes',
          eyebrow: 'Notes',
          heading: 'Decisions to make before launch',
          lead: 'These are operational, not technical — and leaving them vague stalls the project later.',
          items: [
            'How callers are told they are speaking with AI. We state it at the start of the call as standard.',
            'How recording is disclosed, how long it is kept and what it is used for.',
            'When a call is handed over, and what happens if that person is unavailable.',
            'The final fallback when AI cannot handle a call, so nobody is left unable to reach you.',
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'Frequently asked questions',
          items: [
            { q: 'Can we keep our current phone number?', a: 'In most cases, yes. The approach depends on your line type and contract, so we confirm it in the first consultation. Keeping your existing phones and routing only overflow to AI is also possible.' },
            { q: 'Can it handle accents or fast speech?', a: 'Accuracy is practical for ordinary conversation, but it is not 100%. That is exactly why we design an exit — if it has asked twice and still cannot tell, the call goes to a person.' },
            { q: 'Where do we see call history?', a: 'Every call leaves a summary, extracted fields and a recording. These can be pushed into your CRM or chat tool so notifications arrive where your team already works.' },
            { q: 'Do we still need people on the phone?', a: 'Yes. AI covers first response; calls needing judgement or negotiation reach a person. The goal is not fewer staff but fewer interruptions.' },
          ],
        },
      ],
      cta: {
        heading: 'Let’s work out which calls AI can take',
        lead: 'Tell us what is coming in and how much, and we will separate what AI can answer from what should stay with your team. The first consultation is free.',
        button: 'Book a free consultation',
        sub: 'Any data on call types helps us be more specific.',
      },
    },

    'salesforce-ai': {
      slug: 'salesforce-ai',
      navLabel: 'Salesforce AI',
      seoTitle: 'Salesforce AI enablement | From a data entry box to a working system - MGC Inc.',
      seoDescription: 'Make Salesforce more than a place to type. We reduce data entry, surface insight from what you have, and judge honestly whether standard AI features are enough.',
      image: '/assets/service/salesforce-ai.png',
      imageAlt: 'Diagram of CRM data layers feeding upward into higher-level automation',
      hero: {
        badge: 'Salesforce × AI',
        title: 'From a box you type into, to a system that works.',
        titleSub: '— Put the data you already have to work —',
        lead: 'Salesforce is in place, but entry lags and nobody opens the reports. AI helps from two directions: lowering the cost of entry, and turning what is stored into the next move. We design and build both.',
        points: ['Less manual entry', 'Insight from your own data', 'Honest call on standard features'],
      },
      sections: [
        {
          type: 'problems',
          eyebrow: 'Problem',
          heading: 'Does this sound familiar?',
          lead: 'When Salesforce fails to stick, the cause is usually the imbalance between entering data and getting value back.',
          items: [
            'Entry is a burden, so records land days late or not at all',
            'Fields are filled, but with “visit” and “considering” — useless later',
            'Reports exist, nobody opens them, and meetings still run on spreadsheets',
            'Similar past deals exist but cannot be found, so every proposal starts from zero',
            'Agentforce or Einstein has been recommended, but you cannot tell if you need it',
          ],
        },
        {
          type: 'layers',
          eyebrow: 'Approach',
          heading: 'Three stages',
          lead: 'Aiming straight for autonomous agents fails. Each stage depends on the one below it.',
          layers: [
            {
              stage: 'STAGE 1',
              title: 'Reduce entry',
              desc: 'Cut how much people type by hand. Skip this and analysis has nothing to work with.',
              examples: [
                'Draft activity records automatically from a voice memo after a meeting',
                'Extract next actions and due dates from email threads',
                'Automate lead capture and duplicate checks from cards and web forms',
              ],
            },
            {
              stage: 'STAGE 2',
              title: 'Surface insight',
              desc: 'Turn stored data into patterns people have not noticed — delivered to them rather than waiting in a report.',
              examples: [
                'Describe what the deals you win actually have in common',
                'Detect stalled opportunities and notify the owner with likely reasons',
                'Make past similar deals and the materials used searchable',
              ],
            },
            {
              stage: 'STAGE 3',
              title: 'Let agents act',
              desc: 'AI moves work forward rather than only advising. This is where an agent platform such as Agentforce starts to earn its cost.',
              examples: [
                'Draft first responses to inbound enquiries for approval',
                'Raise and run follow-up tasks when conditions are met',
                'Generate quote drafts from past deals for a person to confirm',
              ],
            },
          ],
        },
        {
          type: 'compare',
          eyebrow: 'Judgement',
          heading: 'Standard features, or build?',
          lead: 'If Salesforce’s own AI covers it, that is the fastest route. We make this call before assuming anything needs building.',
          leftLabel: 'Standard features fit',
          rightLabel: 'Worth building',
          rows: [
            { axis: 'Process', left: 'Follows a conventional sales process', right: 'Shaped by your own practices and approvals' },
            { axis: 'Data', left: 'Mostly lives inside Salesforce', right: 'Spans core systems, spreadsheets and other SaaS' },
            { axis: 'Accuracy needed', left: 'Useful as a rough signal', right: 'Drives decisions, so needs accuracy and explanation' },
            { axis: 'Licensing', left: 'Few users, cost adds up', right: 'Company-wide cost spikes, or usage falls outside scope' },
            { axis: 'Timeline', left: 'Start quickly', right: 'Take longer to fit your business properly' },
          ],
        },
        {
          type: 'cards',
          eyebrow: 'Why MGC',
          heading: 'We do not sell the licences',
          lead: 'MGC does not resell Salesforce, so when standard features are enough, we say so.',
          cards: [
            { title: 'We start with whether', desc: 'We do not assume AI. If the blockage is entry design or process, we propose that instead.' },
            { title: 'We connect what is outside', desc: 'Real data sits beyond Salesforce too. We start by deciding which system is the source of truth.' },
            { title: 'Built for the people typing', desc: 'Systems that only help management never get filled in. We judge designs by whether entry actually got shorter.' },
            { title: 'We leave the operation behind', desc: 'We document decisions and procedures so the system stays maintainable after handover.' },
          ],
        },
        {
          type: 'steps',
          eyebrow: 'Process',
          heading: 'How we work',
          lead: 'We start by looking at how it is used today — not just the configuration screens, but the data actually in there.',
          steps: [
            { no: '01', title: 'Understand today', desc: 'Which fields get filled, how long entry takes, which reports are genuinely opened.' },
            { no: '02', title: 'Choose the target', desc: 'One process that both matters and is easy to verify. Company-wide rollout is not the first move.' },
            { no: '03', title: 'Decide the build', desc: 'Standard features or custom, with cost and licensing estimated at this point.' },
            { no: '04', title: 'Build alongside', desc: 'One team goes first, on real data, while existing ways of working continue.' },
            { no: '05', title: 'Roll out and embed', desc: 'Document the procedure, widen the scope, and leave the decision criteria in-house.' },
          ],
        },
        {
          type: 'faq',
          eyebrow: 'FAQ',
          heading: 'Frequently asked questions',
          items: [
            { q: 'Do we need Agentforce or Einstein licences?', a: 'It depends on the design. Standard AI features require the matching licence, but a setup that calls external AI via API may not. We lay out which fits your requirements and budget as the first decision.' },
            { q: 'Does our Salesforce data go to an external AI?', a: 'That depends on the design. Setups that keep data in place, and setups that expose only a defined subset, are both possible. We make explicit what leaves and choose an option that fits your internal policy.' },
            { q: 'Much of our data is missing. Can we still start?', a: 'Yes — that is usually the first target. Analysis on thin data produces nothing, so we normally begin at Stage 1, reducing the cost of entry.' },
            { q: 'Can you do the same with kintone or another CRM?', a: 'Yes. We are not Salesforce-only; any CRM with an API can support the same approach. We do not propose replacing what you use.' },
          ],
        },
      ],
      cta: {
        heading: 'Show us how Salesforce is used today',
        lead: 'We will look at the real data and the way it is run, then separate what AI can fix from what it cannot. The first consultation is free.',
        button: 'Book a free consultation',
        sub: 'If standard features are enough, we will tell you.',
      },
    },
  },
};
