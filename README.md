# Environment Configuration

This project requires a `.env` file to configure the necessary environment variables for database access and Cloudflare object storage. Each variable is described below with instructions on where to obtain the required values.

## Environment Variables

### 1. `DATABASE_URL`
- **Description**: The URL connection string for your database.
- **Format**: `protocol://user:password@hostname:port/database`
- **Example**: `postgres://user:password@localhost:5432/mydatabase`
- **Note**: Ensure the URL matches the database you’re using (e.g., `postgres://` for PostgreSQL).

### 2. `CLOUDFLARE_PUBLIC_URL`
- **Description**: The public URL of your Cloudflare storage endpoint.
- **Format**: Typically in the format `https://<account-id>.r2.cloudflarestorage.com/<bucket-name>`
- **Example**: `https://12345abcd.r2.cloudflarestorage.com/my-bucket`

### 3. `CLOUDFLARE_ACCOUNT_ID`
- **Description**: Your Cloudflare account ID, used for authentication and accessing Cloudflare services.
- **How to Find It**: 
  - Log in to your Cloudflare account.
  - Go to the **Account Home** or **R2 Storage** section.
  - Locate the **Account ID** under your account settings.
- **Example**: `12345abcd`

### 4. `CLOUDFLARE_ACCESS_KEY`
- **Description**: The Cloudflare access key for programmatic access to the R2 storage.
- **How to Obtain It**:
  - In your Cloudflare dashboard, navigate to **R2** or **API Tokens**.
  - Generate or view the existing access key for your project.
- **Example**: `abcd1234accesskey`

### 5. `CLOUDFLARE_BUCKET_NAME`
- **Description**: The name of your Cloudflare R2 bucket where files will be stored.
- **How to Set It**:
  - In the Cloudflare dashboard, go to **R2 Storage**.
  - Either create a new bucket or use an existing one.
- **Example**: `my-bucket`

### 6. `CLOUDFLARE_SECRET_ACCESS_KEY`
- **Description**: The secret access key for accessing Cloudflare R2 securely.
- **How to Obtain It**:
  - Alongside the `CLOUDFLARE_ACCESS_KEY`, the secret key is generated in **R2** or **API Tokens**.
  - Store this key securely and do not share it publicly.
- **Example**: `abcd1234secretkey`

## Setting Up the .env File
Copy the variable names into a `.env` file in the root directory of the project, and fill in each value with the information described above.

```plaintext
DATABASE_URL='your_database_url'
CLOUDFLARE_PUBLIC_URL='your_cloudflare_public_url'
CLOUDFLARE_ACCOUNT_ID='your_cloudflare_account_id'
CLOUDFLARE_ACCESS_KEY='your_cloudflare_access_key'
CLOUDFLARE_BUCKET_NAME='your_cloudflare_bucket_name'
CLOUDFLARE_SECRET_ACCESS_KEY='your_cloudflare_secret_access_key'
