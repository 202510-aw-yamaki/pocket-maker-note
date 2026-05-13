# Future Note: Statistical Analysis of Household Standard Products

## 日本語要約

このファイルは、将来的な拡張候補として「家庭で定番化している商品」の
傾向分析を検討するためのメモです。

現段階では、この機能は実装予定に含めません。

現在のMVPは、あくまでローカル完結のポケット帳です。ログイン、クラウド同期、
自動データ収集、写真アップロード、メモ送信、アカウント作成は行いません。

将来的に統計協力機能を検討する場合でも、対象にできる項目は最大で以下に限定します。

- `itemName`
- `makerName`
- `categoryName`
- `productDetail`

以下は統計協力の対象外とします。

- 写真
- メモ
- 最後に買った日
- 作成日時・更新日時
- 個別ID
- 端末ID
- アカウント情報
- 世帯識別子
- 連絡先情報

また、企業等へ提供する場合は、個別の登録内容ではなく、一定件数以上に集計された
統計データだけを対象にします。

注意点として、商品情報だけでも、乳幼児用品、医療・介護用品、アレルギー対応商品、
宗教・食習慣に関わる商品などから、家庭の事情が推測される可能性があります。
そのため、将来的に実装する場合は、事前にプライバシー・法務レビューを行い、
ユーザーの明示的な同意、送信対象の事前表示、停止方法、保存期間、削除可否を
明確にする必要があります。

個人情報保護委員会の説明では、統計情報と匿名加工情報は区別されています。
複数人の情報を分類ごとに集計し、特定個人との対応関係が排斥されている統計情報は、
一般に個人情報に該当しないとされています。一方で、匿名加工情報は個人単位の
情報を含み、法律上の基準に従って加工する必要があります。

このプロジェクトでは、単に名前やIDを削っただけのデータを安易に
`匿名加工情報` と呼ばないことを前提とします。

## Status

This is a future expansion note.

This feature is not planned for the current MVP and must not be implemented
without a separate product, privacy, and legal review.

The current MVP remains local-first:

- No login
- No cloud sync
- No automatic data collection
- No photo upload
- No memo upload
- No account or household profile

## Purpose

The possible future purpose is to analyze trends in products that households
have standardized on.

The intended use case is to understand, in aggregate, patterns such as:

- Which makers are commonly selected for a given item type
- Which categories are commonly registered
- Which product variants or sizes are often treated as the household default

The intended business use is aggregated market research or product improvement
feedback for manufacturers and related companies.

The product must not provide individual household records, photos, free-form
memos, or account-level data to companies.

## Potential Data Scope

If this feature is considered in the future, the maximum raw fields eligible for
statistical cooperation are:

- `itemName`
- `makerName`
- `categoryName`
- `productDetail`

The following fields must be excluded from statistical cooperation:

- `photoDataUrl`
- `memo`
- `lastPurchasedAt`
- `createdAt`
- `updatedAt`
- `id`
- Device identifiers
- Account identifiers
- Household identifiers
- Contact information

Photos and memos are especially sensitive because they may include background
details, handwritten notes, family context, health context, addresses, or other
information unrelated to product trend analysis.

## Product Boundary

This feature, if ever implemented, must remain separate from shopping-list
features.

It must not introduce:

- Shopping request management
- Purchase task tracking
- Quantity management
- Inventory management
- Family member management
- Advertising tracking
- User or household profiling
- Direct manufacturer access to individual records

The app's core value remains:

> Confirming the usual maker, size, product, and photo while shopping.

## Required Future UX Principles

If statistical cooperation is implemented, it must be opt-in.

Required UX conditions:

- Default OFF
- Clear explanation before enabling
- Explicit consent by the user
- Preview of the fields that will be sent
- Clear statement that photos and memos are not sent
- Ability to turn cooperation OFF later
- Clear explanation of whether past submissions can be deleted or withdrawn
- No dark patterns

The feature should be named in a way that makes the purpose clear, such as:

- `統計協力`
- `定番商品の傾向調査に協力`

It should not be named in a way that implies cloud sync, backup, or family
sharing.

## Aggregation Policy

External use should be based on aggregated statistics only.

Examples of acceptable aggregate outputs:

```txt
categoryName: 調味料
itemName: ケチャップ
makerName: カゴメ
productDetail: トマトケチャップ 500g
count: 128
```

Examples of outputs that should not be provided externally:

```txt
household_123 registered:
- ケチャップ / カゴメ / トマトケチャップ 500g
- マヨネーズ / キユーピー / キユーピー マヨネーズ 450g
```

Aggregation should include minimum-count suppression.

For example:

- Do not publish or provide rows below a minimum count threshold.
- Consider thresholds such as 10 or 20 records per aggregate row.
- Suppress rare product-detail combinations.
- Avoid overly narrow slices that could reveal one household's habits.

The exact threshold must be decided during privacy review, not guessed during
implementation.

## Privacy and Personal Information Concerns

Even if the selected fields do not directly include names or contact
information, product registration data can still reveal private household
context.

Examples of possible sensitive inferences:

- Baby products may imply children or age ranges.
- Medical, allergy, or care-related goods may imply health conditions.
- Religious or dietary products may imply beliefs or lifestyle.
- Rare product combinations may make a household more identifiable.
- Product details may include unusually specific notes if users enter them in
  `productDetail`.

Therefore, future implementation must treat raw submitted records as sensitive
application data until they are safely aggregated or otherwise processed under a
reviewed policy.

## Statistical Information vs. Anonymously Processed Information

Japanese Personal Information Protection Commission materials distinguish
statistical information from anonymously processed information.

In general terms:

- Statistical information is produced by extracting common elements from
  multiple people's data and aggregating them by category. If the relationship
  to a specific individual is excluded, it is generally not treated as personal
  information.
- Anonymously processed information is still information about individuals, but
  it has been processed under legal standards so that a specific individual
  cannot be identified and the original personal information cannot be restored.

This project must not casually label raw submissions or lightly transformed
records as `匿名加工情報`.

If future implementation creates or handles anonymously processed information,
the design must be reviewed against applicable law and official guidance before
implementation.

References:

- 個人情報保護委員会: 統計情報と匿名加工情報の違いは何ですか。
  https://www.ppc.go.jp/all_faq_index/faq1-q15-2
- 個人情報保護委員会: 匿名加工情報
  https://www.ppc.go.jp/personalinfo/tokumeikakouInfo/

## Possible Future Architecture

A future implementation would require new infrastructure that does not exist in
the current MVP.

Possible high-level flow:

1. User explicitly enables statistical cooperation.
2. App extracts only `itemName`, `makerName`, `categoryName`, and
   `productDetail`.
3. App shows the extracted fields before sending.
4. App sends only the approved fields to a controlled collection endpoint.
5. Server validates and normalizes records.
6. Server aggregates records with minimum-count suppression.
7. Only aggregated statistics are used for external reporting.

This architecture would require:

- Backend endpoint
- Privacy policy update
- Consent record handling
- Data retention policy
- Security controls
- Abuse prevention
- Deletion or opt-out policy
- Legal/privacy review

None of these should be introduced in the MVP.

## Implementation Gate

Before implementing this feature, the following must be true:

- Product scope is approved.
- Legal/privacy review is complete.
- Data fields are frozen.
- User consent UX is designed.
- Privacy policy text is prepared.
- Raw record retention period is defined.
- External reporting format is defined.
- Minimum-count suppression policy is defined.
- It is confirmed that photos, memos, and account identifiers are excluded.

Until then, this remains a documented future option only.
