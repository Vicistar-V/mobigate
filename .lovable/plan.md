
## Add Conditional Input Fields to Business Type Selections

### Overview
Add mandatory extra input fields that appear when specific business types are selected in the sub-merchant application form. Also update the reapply data to include these new fields.

### Business Type Field Mapping
- **Retail Shop** -- additional "Shop Address" text input (mandatory)
- **Mobi Kiosk** -- no additional field
- **Online Store** -- additional "Website / Store URL" text input (mandatory)
- **Mobi Shop** -- additional "Mobi Shop Web Address" text input (mandatory)
- **Mobile Agent** -- no additional field

### Changes

#### 1. `src/pages/SubMerchantApplicationPage.tsx`

**Form state**: Add three new fields to the form state:
- `retailShopAddress: string`
- `onlineStoreUrl: string`
- `mobiShopUrl: string`

Pre-fill these from `reapplyData` if available.

**Validation**: Update `isValid` to require:
- `retailShopAddress` is filled when "retail_shop" is selected
- `onlineStoreUrl` is filled when "online_store" is selected
- `mobiShopUrl` is filled when "mobi_shop" is selected

**UI**: After each business type checkbox that requires an extra field, conditionally render an Input below it (inside the same label/container or directly after). The input appears only when that business type is checked.

#### 2. `src/pages/SubMerchantApplicationStatus.tsx`

**Reapply data**: Add mock values for the new fields in the `previousData` object:
- `retailShopAddress: "45 Market Road, Port Harcourt"`
- `onlineStoreUrl: ""` (not applicable since mock has retail_shop and mobi_kiosk)
- `mobiShopUrl: ""` (not applicable)

### Technical Details
- Extra input fields use the same styling as existing inputs (`h-11 rounded-xl text-sm`)
- Fields slide in below their parent checkbox with a small top margin
- Each conditional input has a descriptive placeholder (e.g., "Enter your shop address", "Enter website or store URL", "Enter Mobi Shop web address")
