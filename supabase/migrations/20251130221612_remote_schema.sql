create schema if not exists "directus";

create sequence "directus"."directus_activity_id_seq";

create sequence "directus"."directus_fields_id_seq";

create sequence "directus"."directus_notifications_id_seq";

create sequence "directus"."directus_permissions_id_seq";

create sequence "directus"."directus_presets_id_seq";

create sequence "directus"."directus_relations_id_seq";

create sequence "directus"."directus_revisions_id_seq";

create sequence "directus"."directus_settings_id_seq";

create sequence "directus"."directus_webhooks_id_seq";


  create table "directus"."directus_access" (
    "id" uuid not null,
    "role" uuid,
    "user" uuid,
    "policy" uuid not null,
    "sort" integer
      );



  create table "directus"."directus_activity" (
    "id" integer not null default nextval('directus.directus_activity_id_seq'::regclass),
    "action" character varying(45) not null,
    "user" uuid,
    "timestamp" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "ip" character varying(50),
    "user_agent" text,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "origin" character varying(255)
      );



  create table "directus"."directus_collections" (
    "collection" character varying(64) not null,
    "icon" character varying(64),
    "note" text,
    "display_template" character varying(255),
    "hidden" boolean not null default false,
    "singleton" boolean not null default false,
    "translations" json,
    "archive_field" character varying(64),
    "archive_app_filter" boolean not null default true,
    "archive_value" character varying(255),
    "unarchive_value" character varying(255),
    "sort_field" character varying(64),
    "accountability" character varying(255) default 'all'::character varying,
    "color" character varying(255),
    "item_duplication_fields" json,
    "sort" integer,
    "group" character varying(64),
    "collapse" character varying(255) not null default 'open'::character varying,
    "preview_url" character varying(255),
    "versioning" boolean not null default false
      );



  create table "directus"."directus_comments" (
    "id" uuid not null,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "comment" text not null,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_updated" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "user_updated" uuid
      );



  create table "directus"."directus_dashboards" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "icon" character varying(64) not null default 'dashboard'::character varying,
    "note" text,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "color" character varying(255)
      );



  create table "directus"."directus_extensions" (
    "enabled" boolean not null default true,
    "id" uuid not null,
    "folder" character varying(255) not null,
    "source" character varying(255) not null,
    "bundle" uuid
      );



  create table "directus"."directus_fields" (
    "id" integer not null default nextval('directus.directus_fields_id_seq'::regclass),
    "collection" character varying(64) not null,
    "field" character varying(64) not null,
    "special" character varying(64),
    "interface" character varying(64),
    "options" json,
    "display" character varying(64),
    "display_options" json,
    "readonly" boolean not null default false,
    "hidden" boolean not null default false,
    "sort" integer,
    "width" character varying(30) default 'full'::character varying,
    "translations" json,
    "note" text,
    "conditions" json,
    "required" boolean default false,
    "group" character varying(64),
    "validation" json,
    "validation_message" text,
    "searchable" boolean not null default true
      );



  create table "directus"."directus_files" (
    "id" uuid not null,
    "storage" character varying(255) not null,
    "filename_disk" character varying(255),
    "filename_download" character varying(255) not null,
    "title" character varying(255),
    "type" character varying(255),
    "folder" uuid,
    "uploaded_by" uuid,
    "created_on" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "modified_by" uuid,
    "modified_on" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "charset" character varying(50),
    "filesize" bigint,
    "width" integer,
    "height" integer,
    "duration" integer,
    "embed" character varying(200),
    "description" text,
    "location" text,
    "tags" text,
    "metadata" json,
    "focal_point_x" integer,
    "focal_point_y" integer,
    "tus_id" character varying(64),
    "tus_data" json,
    "uploaded_on" timestamp with time zone
      );



  create table "directus"."directus_flows" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "icon" character varying(64),
    "color" character varying(255),
    "description" text,
    "status" character varying(255) not null default 'active'::character varying,
    "trigger" character varying(255),
    "accountability" character varying(255) default 'all'::character varying,
    "options" json,
    "operation" uuid,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );



  create table "directus"."directus_folders" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "parent" uuid
      );



  create table "directus"."directus_migrations" (
    "version" character varying(255) not null,
    "name" character varying(255) not null,
    "timestamp" timestamp with time zone default CURRENT_TIMESTAMP
      );



  create table "directus"."directus_notifications" (
    "id" integer not null default nextval('directus.directus_notifications_id_seq'::regclass),
    "timestamp" timestamp with time zone default CURRENT_TIMESTAMP,
    "status" character varying(255) default 'inbox'::character varying,
    "recipient" uuid not null,
    "sender" uuid,
    "subject" character varying(255) not null,
    "message" text,
    "collection" character varying(64),
    "item" character varying(255)
      );



  create table "directus"."directus_operations" (
    "id" uuid not null,
    "name" character varying(255),
    "key" character varying(255) not null,
    "type" character varying(255) not null,
    "position_x" integer not null,
    "position_y" integer not null,
    "options" json,
    "resolve" uuid,
    "reject" uuid,
    "flow" uuid not null,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );



  create table "directus"."directus_panels" (
    "id" uuid not null,
    "dashboard" uuid not null,
    "name" character varying(255),
    "icon" character varying(64) default NULL::character varying,
    "color" character varying(10),
    "show_header" boolean not null default false,
    "note" text,
    "type" character varying(255) not null,
    "position_x" integer not null,
    "position_y" integer not null,
    "width" integer not null,
    "height" integer not null,
    "options" json,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );



  create table "directus"."directus_permissions" (
    "id" integer not null default nextval('directus.directus_permissions_id_seq'::regclass),
    "collection" character varying(64) not null,
    "action" character varying(10) not null,
    "permissions" json,
    "validation" json,
    "presets" json,
    "fields" text,
    "policy" uuid not null
      );



  create table "directus"."directus_policies" (
    "id" uuid not null,
    "name" character varying(100) not null,
    "icon" character varying(64) not null default 'badge'::character varying,
    "description" text,
    "ip_access" text,
    "enforce_tfa" boolean not null default false,
    "admin_access" boolean not null default false,
    "app_access" boolean not null default false
      );



  create table "directus"."directus_presets" (
    "id" integer not null default nextval('directus.directus_presets_id_seq'::regclass),
    "bookmark" character varying(255),
    "user" uuid,
    "role" uuid,
    "collection" character varying(64),
    "search" character varying(100),
    "layout" character varying(100) default 'tabular'::character varying,
    "layout_query" json,
    "layout_options" json,
    "refresh_interval" integer,
    "filter" json,
    "icon" character varying(64) default 'bookmark'::character varying,
    "color" character varying(255)
      );



  create table "directus"."directus_relations" (
    "id" integer not null default nextval('directus.directus_relations_id_seq'::regclass),
    "many_collection" character varying(64) not null,
    "many_field" character varying(64) not null,
    "one_collection" character varying(64),
    "one_field" character varying(64),
    "one_collection_field" character varying(64),
    "one_allowed_collections" text,
    "junction_field" character varying(64),
    "sort_field" character varying(64),
    "one_deselect_action" character varying(255) not null default 'nullify'::character varying
      );



  create table "directus"."directus_revisions" (
    "id" integer not null default nextval('directus.directus_revisions_id_seq'::regclass),
    "activity" integer not null,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "data" json,
    "delta" json,
    "parent" integer,
    "version" uuid
      );



  create table "directus"."directus_roles" (
    "id" uuid not null,
    "name" character varying(100) not null,
    "icon" character varying(64) not null default 'supervised_user_circle'::character varying,
    "description" text,
    "parent" uuid
      );



  create table "directus"."directus_sessions" (
    "token" character varying(64) not null,
    "user" uuid,
    "expires" timestamp with time zone not null,
    "ip" character varying(255),
    "user_agent" text,
    "share" uuid,
    "origin" character varying(255),
    "next_token" character varying(64)
      );



  create table "directus"."directus_settings" (
    "id" integer not null default nextval('directus.directus_settings_id_seq'::regclass),
    "project_name" character varying(100) not null default 'Directus'::character varying,
    "project_url" character varying(255),
    "project_color" character varying(255) not null default '#6644FF'::character varying,
    "project_logo" uuid,
    "public_foreground" uuid,
    "public_background" uuid,
    "public_note" text,
    "auth_login_attempts" integer default 25,
    "auth_password_policy" character varying(100),
    "storage_asset_transform" character varying(7) default 'all'::character varying,
    "storage_asset_presets" json,
    "custom_css" text,
    "storage_default_folder" uuid,
    "basemaps" json,
    "mapbox_key" character varying(255),
    "module_bar" json,
    "project_descriptor" character varying(100),
    "default_language" character varying(255) not null default 'en-US'::character varying,
    "custom_aspect_ratios" json,
    "public_favicon" uuid,
    "default_appearance" character varying(255) not null default 'auto'::character varying,
    "default_theme_light" character varying(255),
    "theme_light_overrides" json,
    "default_theme_dark" character varying(255),
    "theme_dark_overrides" json,
    "report_error_url" character varying(255),
    "report_bug_url" character varying(255),
    "report_feature_url" character varying(255),
    "public_registration" boolean not null default false,
    "public_registration_verify_email" boolean not null default true,
    "public_registration_role" uuid,
    "public_registration_email_filter" json,
    "visual_editor_urls" json,
    "project_id" uuid,
    "mcp_enabled" boolean not null default false,
    "mcp_allow_deletes" boolean not null default false,
    "mcp_prompts_collection" character varying(255) default NULL::character varying,
    "mcp_system_prompt_enabled" boolean not null default true,
    "mcp_system_prompt" text,
    "project_owner" character varying(255),
    "project_usage" character varying(255),
    "org_name" character varying(255),
    "product_updates" boolean,
    "project_status" character varying(255)
      );



  create table "directus"."directus_shares" (
    "id" uuid not null,
    "name" character varying(255),
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "role" uuid,
    "password" character varying(255),
    "user_created" uuid,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_start" timestamp with time zone,
    "date_end" timestamp with time zone,
    "times_used" integer default 0,
    "max_uses" integer
      );



  create table "directus"."directus_translations" (
    "id" uuid not null,
    "language" character varying(255) not null,
    "key" character varying(255) not null,
    "value" text not null
      );



  create table "directus"."directus_users" (
    "id" uuid not null,
    "first_name" character varying(50),
    "last_name" character varying(50),
    "email" character varying(128),
    "password" character varying(255),
    "location" character varying(255),
    "title" character varying(50),
    "description" text,
    "tags" json,
    "avatar" uuid,
    "language" character varying(255) default NULL::character varying,
    "tfa_secret" character varying(255),
    "status" character varying(16) not null default 'active'::character varying,
    "role" uuid,
    "token" character varying(255),
    "last_access" timestamp with time zone,
    "last_page" character varying(255),
    "provider" character varying(128) not null default 'default'::character varying,
    "external_identifier" character varying(255),
    "auth_data" json,
    "email_notifications" boolean default true,
    "appearance" character varying(255),
    "theme_dark" character varying(255),
    "theme_light" character varying(255),
    "theme_light_overrides" json,
    "theme_dark_overrides" json,
    "text_direction" character varying(255) not null default 'auto'::character varying
      );



  create table "directus"."directus_versions" (
    "id" uuid not null,
    "key" character varying(64) not null,
    "name" character varying(255),
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "hash" character varying(255),
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_updated" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "user_updated" uuid,
    "delta" json
      );



  create table "directus"."directus_webhooks" (
    "id" integer not null default nextval('directus.directus_webhooks_id_seq'::regclass),
    "name" character varying(255) not null,
    "method" character varying(10) not null default 'POST'::character varying,
    "url" character varying(255) not null,
    "status" character varying(10) not null default 'active'::character varying,
    "data" boolean not null default true,
    "actions" character varying(100) not null,
    "collections" character varying(255) not null,
    "headers" json,
    "was_active_before_deprecation" boolean not null default false,
    "migrated_flow" uuid
      );


alter sequence "directus"."directus_activity_id_seq" owned by "directus"."directus_activity"."id";

alter sequence "directus"."directus_fields_id_seq" owned by "directus"."directus_fields"."id";

alter sequence "directus"."directus_notifications_id_seq" owned by "directus"."directus_notifications"."id";

alter sequence "directus"."directus_permissions_id_seq" owned by "directus"."directus_permissions"."id";

alter sequence "directus"."directus_presets_id_seq" owned by "directus"."directus_presets"."id";

alter sequence "directus"."directus_relations_id_seq" owned by "directus"."directus_relations"."id";

alter sequence "directus"."directus_revisions_id_seq" owned by "directus"."directus_revisions"."id";

alter sequence "directus"."directus_settings_id_seq" owned by "directus"."directus_settings"."id";

alter sequence "directus"."directus_webhooks_id_seq" owned by "directus"."directus_webhooks"."id";

CREATE UNIQUE INDEX directus_access_pkey ON directus.directus_access USING btree (id);

CREATE UNIQUE INDEX directus_activity_pkey ON directus.directus_activity USING btree (id);

CREATE INDEX directus_activity_timestamp_index ON directus.directus_activity USING btree ("timestamp");

CREATE UNIQUE INDEX directus_collections_pkey ON directus.directus_collections USING btree (collection);

CREATE UNIQUE INDEX directus_comments_pkey ON directus.directus_comments USING btree (id);

CREATE UNIQUE INDEX directus_dashboards_pkey ON directus.directus_dashboards USING btree (id);

CREATE UNIQUE INDEX directus_extensions_pkey ON directus.directus_extensions USING btree (id);

CREATE UNIQUE INDEX directus_fields_pkey ON directus.directus_fields USING btree (id);

CREATE UNIQUE INDEX directus_files_pkey ON directus.directus_files USING btree (id);

CREATE UNIQUE INDEX directus_flows_operation_unique ON directus.directus_flows USING btree (operation);

CREATE UNIQUE INDEX directus_flows_pkey ON directus.directus_flows USING btree (id);

CREATE UNIQUE INDEX directus_folders_pkey ON directus.directus_folders USING btree (id);

CREATE UNIQUE INDEX directus_migrations_pkey ON directus.directus_migrations USING btree (version);

CREATE UNIQUE INDEX directus_notifications_pkey ON directus.directus_notifications USING btree (id);

CREATE UNIQUE INDEX directus_operations_pkey ON directus.directus_operations USING btree (id);

CREATE UNIQUE INDEX directus_operations_reject_unique ON directus.directus_operations USING btree (reject);

CREATE UNIQUE INDEX directus_operations_resolve_unique ON directus.directus_operations USING btree (resolve);

CREATE UNIQUE INDEX directus_panels_pkey ON directus.directus_panels USING btree (id);

CREATE UNIQUE INDEX directus_permissions_pkey ON directus.directus_permissions USING btree (id);

CREATE UNIQUE INDEX directus_policies_pkey ON directus.directus_policies USING btree (id);

CREATE UNIQUE INDEX directus_presets_pkey ON directus.directus_presets USING btree (id);

CREATE UNIQUE INDEX directus_relations_pkey ON directus.directus_relations USING btree (id);

CREATE INDEX directus_revisions_parent_index ON directus.directus_revisions USING btree (parent);

CREATE UNIQUE INDEX directus_revisions_pkey ON directus.directus_revisions USING btree (id);

CREATE UNIQUE INDEX directus_roles_pkey ON directus.directus_roles USING btree (id);

CREATE UNIQUE INDEX directus_sessions_pkey ON directus.directus_sessions USING btree (token);

CREATE UNIQUE INDEX directus_settings_pkey ON directus.directus_settings USING btree (id);

CREATE UNIQUE INDEX directus_shares_pkey ON directus.directus_shares USING btree (id);

CREATE UNIQUE INDEX directus_translations_pkey ON directus.directus_translations USING btree (id);

CREATE UNIQUE INDEX directus_users_email_unique ON directus.directus_users USING btree (email);

CREATE UNIQUE INDEX directus_users_external_identifier_unique ON directus.directus_users USING btree (external_identifier);

CREATE UNIQUE INDEX directus_users_pkey ON directus.directus_users USING btree (id);

CREATE UNIQUE INDEX directus_users_token_unique ON directus.directus_users USING btree (token);

CREATE UNIQUE INDEX directus_versions_pkey ON directus.directus_versions USING btree (id);

CREATE UNIQUE INDEX directus_webhooks_pkey ON directus.directus_webhooks USING btree (id);

alter table "directus"."directus_access" add constraint "directus_access_pkey" PRIMARY KEY using index "directus_access_pkey";

alter table "directus"."directus_activity" add constraint "directus_activity_pkey" PRIMARY KEY using index "directus_activity_pkey";

alter table "directus"."directus_collections" add constraint "directus_collections_pkey" PRIMARY KEY using index "directus_collections_pkey";

alter table "directus"."directus_comments" add constraint "directus_comments_pkey" PRIMARY KEY using index "directus_comments_pkey";

alter table "directus"."directus_dashboards" add constraint "directus_dashboards_pkey" PRIMARY KEY using index "directus_dashboards_pkey";

alter table "directus"."directus_extensions" add constraint "directus_extensions_pkey" PRIMARY KEY using index "directus_extensions_pkey";

alter table "directus"."directus_fields" add constraint "directus_fields_pkey" PRIMARY KEY using index "directus_fields_pkey";

alter table "directus"."directus_files" add constraint "directus_files_pkey" PRIMARY KEY using index "directus_files_pkey";

alter table "directus"."directus_flows" add constraint "directus_flows_pkey" PRIMARY KEY using index "directus_flows_pkey";

alter table "directus"."directus_folders" add constraint "directus_folders_pkey" PRIMARY KEY using index "directus_folders_pkey";

alter table "directus"."directus_migrations" add constraint "directus_migrations_pkey" PRIMARY KEY using index "directus_migrations_pkey";

alter table "directus"."directus_notifications" add constraint "directus_notifications_pkey" PRIMARY KEY using index "directus_notifications_pkey";

alter table "directus"."directus_operations" add constraint "directus_operations_pkey" PRIMARY KEY using index "directus_operations_pkey";

alter table "directus"."directus_panels" add constraint "directus_panels_pkey" PRIMARY KEY using index "directus_panels_pkey";

alter table "directus"."directus_permissions" add constraint "directus_permissions_pkey" PRIMARY KEY using index "directus_permissions_pkey";

alter table "directus"."directus_policies" add constraint "directus_policies_pkey" PRIMARY KEY using index "directus_policies_pkey";

alter table "directus"."directus_presets" add constraint "directus_presets_pkey" PRIMARY KEY using index "directus_presets_pkey";

alter table "directus"."directus_relations" add constraint "directus_relations_pkey" PRIMARY KEY using index "directus_relations_pkey";

alter table "directus"."directus_revisions" add constraint "directus_revisions_pkey" PRIMARY KEY using index "directus_revisions_pkey";

alter table "directus"."directus_roles" add constraint "directus_roles_pkey" PRIMARY KEY using index "directus_roles_pkey";

alter table "directus"."directus_sessions" add constraint "directus_sessions_pkey" PRIMARY KEY using index "directus_sessions_pkey";

alter table "directus"."directus_settings" add constraint "directus_settings_pkey" PRIMARY KEY using index "directus_settings_pkey";

alter table "directus"."directus_shares" add constraint "directus_shares_pkey" PRIMARY KEY using index "directus_shares_pkey";

alter table "directus"."directus_translations" add constraint "directus_translations_pkey" PRIMARY KEY using index "directus_translations_pkey";

alter table "directus"."directus_users" add constraint "directus_users_pkey" PRIMARY KEY using index "directus_users_pkey";

alter table "directus"."directus_versions" add constraint "directus_versions_pkey" PRIMARY KEY using index "directus_versions_pkey";

alter table "directus"."directus_webhooks" add constraint "directus_webhooks_pkey" PRIMARY KEY using index "directus_webhooks_pkey";

alter table "directus"."directus_access" add constraint "directus_access_policy_foreign" FOREIGN KEY (policy) REFERENCES directus.directus_policies(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_access" validate constraint "directus_access_policy_foreign";

alter table "directus"."directus_access" add constraint "directus_access_role_foreign" FOREIGN KEY (role) REFERENCES directus.directus_roles(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_access" validate constraint "directus_access_role_foreign";

alter table "directus"."directus_access" add constraint "directus_access_user_foreign" FOREIGN KEY ("user") REFERENCES directus.directus_users(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_access" validate constraint "directus_access_user_foreign";

alter table "directus"."directus_collections" add constraint "directus_collections_group_foreign" FOREIGN KEY ("group") REFERENCES directus.directus_collections(collection) not valid;

alter table "directus"."directus_collections" validate constraint "directus_collections_group_foreign";

alter table "directus"."directus_comments" add constraint "directus_comments_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_comments" validate constraint "directus_comments_user_created_foreign";

alter table "directus"."directus_comments" add constraint "directus_comments_user_updated_foreign" FOREIGN KEY (user_updated) REFERENCES directus.directus_users(id) not valid;

alter table "directus"."directus_comments" validate constraint "directus_comments_user_updated_foreign";

alter table "directus"."directus_dashboards" add constraint "directus_dashboards_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_dashboards" validate constraint "directus_dashboards_user_created_foreign";

alter table "directus"."directus_files" add constraint "directus_files_folder_foreign" FOREIGN KEY (folder) REFERENCES directus.directus_folders(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_files" validate constraint "directus_files_folder_foreign";

alter table "directus"."directus_files" add constraint "directus_files_modified_by_foreign" FOREIGN KEY (modified_by) REFERENCES directus.directus_users(id) not valid;

alter table "directus"."directus_files" validate constraint "directus_files_modified_by_foreign";

alter table "directus"."directus_files" add constraint "directus_files_uploaded_by_foreign" FOREIGN KEY (uploaded_by) REFERENCES directus.directus_users(id) not valid;

alter table "directus"."directus_files" validate constraint "directus_files_uploaded_by_foreign";

alter table "directus"."directus_flows" add constraint "directus_flows_operation_unique" UNIQUE using index "directus_flows_operation_unique";

alter table "directus"."directus_flows" add constraint "directus_flows_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_flows" validate constraint "directus_flows_user_created_foreign";

alter table "directus"."directus_folders" add constraint "directus_folders_parent_foreign" FOREIGN KEY (parent) REFERENCES directus.directus_folders(id) not valid;

alter table "directus"."directus_folders" validate constraint "directus_folders_parent_foreign";

alter table "directus"."directus_notifications" add constraint "directus_notifications_recipient_foreign" FOREIGN KEY (recipient) REFERENCES directus.directus_users(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_notifications" validate constraint "directus_notifications_recipient_foreign";

alter table "directus"."directus_notifications" add constraint "directus_notifications_sender_foreign" FOREIGN KEY (sender) REFERENCES directus.directus_users(id) not valid;

alter table "directus"."directus_notifications" validate constraint "directus_notifications_sender_foreign";

alter table "directus"."directus_operations" add constraint "directus_operations_flow_foreign" FOREIGN KEY (flow) REFERENCES directus.directus_flows(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_operations" validate constraint "directus_operations_flow_foreign";

alter table "directus"."directus_operations" add constraint "directus_operations_reject_foreign" FOREIGN KEY (reject) REFERENCES directus.directus_operations(id) not valid;

alter table "directus"."directus_operations" validate constraint "directus_operations_reject_foreign";

alter table "directus"."directus_operations" add constraint "directus_operations_reject_unique" UNIQUE using index "directus_operations_reject_unique";

alter table "directus"."directus_operations" add constraint "directus_operations_resolve_foreign" FOREIGN KEY (resolve) REFERENCES directus.directus_operations(id) not valid;

alter table "directus"."directus_operations" validate constraint "directus_operations_resolve_foreign";

alter table "directus"."directus_operations" add constraint "directus_operations_resolve_unique" UNIQUE using index "directus_operations_resolve_unique";

alter table "directus"."directus_operations" add constraint "directus_operations_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_operations" validate constraint "directus_operations_user_created_foreign";

alter table "directus"."directus_panels" add constraint "directus_panels_dashboard_foreign" FOREIGN KEY (dashboard) REFERENCES directus.directus_dashboards(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_panels" validate constraint "directus_panels_dashboard_foreign";

alter table "directus"."directus_panels" add constraint "directus_panels_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_panels" validate constraint "directus_panels_user_created_foreign";

alter table "directus"."directus_permissions" add constraint "directus_permissions_policy_foreign" FOREIGN KEY (policy) REFERENCES directus.directus_policies(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_permissions" validate constraint "directus_permissions_policy_foreign";

alter table "directus"."directus_presets" add constraint "directus_presets_role_foreign" FOREIGN KEY (role) REFERENCES directus.directus_roles(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_presets" validate constraint "directus_presets_role_foreign";

alter table "directus"."directus_presets" add constraint "directus_presets_user_foreign" FOREIGN KEY ("user") REFERENCES directus.directus_users(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_presets" validate constraint "directus_presets_user_foreign";

alter table "directus"."directus_revisions" add constraint "directus_revisions_activity_foreign" FOREIGN KEY (activity) REFERENCES directus.directus_activity(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_revisions" validate constraint "directus_revisions_activity_foreign";

alter table "directus"."directus_revisions" add constraint "directus_revisions_parent_foreign" FOREIGN KEY (parent) REFERENCES directus.directus_revisions(id) not valid;

alter table "directus"."directus_revisions" validate constraint "directus_revisions_parent_foreign";

alter table "directus"."directus_revisions" add constraint "directus_revisions_version_foreign" FOREIGN KEY (version) REFERENCES directus.directus_versions(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_revisions" validate constraint "directus_revisions_version_foreign";

alter table "directus"."directus_roles" add constraint "directus_roles_parent_foreign" FOREIGN KEY (parent) REFERENCES directus.directus_roles(id) not valid;

alter table "directus"."directus_roles" validate constraint "directus_roles_parent_foreign";

alter table "directus"."directus_sessions" add constraint "directus_sessions_share_foreign" FOREIGN KEY (share) REFERENCES directus.directus_shares(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_sessions" validate constraint "directus_sessions_share_foreign";

alter table "directus"."directus_sessions" add constraint "directus_sessions_user_foreign" FOREIGN KEY ("user") REFERENCES directus.directus_users(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_sessions" validate constraint "directus_sessions_user_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_project_logo_foreign" FOREIGN KEY (project_logo) REFERENCES directus.directus_files(id) not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_project_logo_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_public_background_foreign" FOREIGN KEY (public_background) REFERENCES directus.directus_files(id) not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_public_background_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_public_favicon_foreign" FOREIGN KEY (public_favicon) REFERENCES directus.directus_files(id) not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_public_favicon_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_public_foreground_foreign" FOREIGN KEY (public_foreground) REFERENCES directus.directus_files(id) not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_public_foreground_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_public_registration_role_foreign" FOREIGN KEY (public_registration_role) REFERENCES directus.directus_roles(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_public_registration_role_foreign";

alter table "directus"."directus_settings" add constraint "directus_settings_storage_default_folder_foreign" FOREIGN KEY (storage_default_folder) REFERENCES directus.directus_folders(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_settings" validate constraint "directus_settings_storage_default_folder_foreign";

alter table "directus"."directus_shares" add constraint "directus_shares_collection_foreign" FOREIGN KEY (collection) REFERENCES directus.directus_collections(collection) ON DELETE CASCADE not valid;

alter table "directus"."directus_shares" validate constraint "directus_shares_collection_foreign";

alter table "directus"."directus_shares" add constraint "directus_shares_role_foreign" FOREIGN KEY (role) REFERENCES directus.directus_roles(id) ON DELETE CASCADE not valid;

alter table "directus"."directus_shares" validate constraint "directus_shares_role_foreign";

alter table "directus"."directus_shares" add constraint "directus_shares_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_shares" validate constraint "directus_shares_user_created_foreign";

alter table "directus"."directus_users" add constraint "directus_users_email_unique" UNIQUE using index "directus_users_email_unique";

alter table "directus"."directus_users" add constraint "directus_users_external_identifier_unique" UNIQUE using index "directus_users_external_identifier_unique";

alter table "directus"."directus_users" add constraint "directus_users_role_foreign" FOREIGN KEY (role) REFERENCES directus.directus_roles(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_users" validate constraint "directus_users_role_foreign";

alter table "directus"."directus_users" add constraint "directus_users_token_unique" UNIQUE using index "directus_users_token_unique";

alter table "directus"."directus_versions" add constraint "directus_versions_collection_foreign" FOREIGN KEY (collection) REFERENCES directus.directus_collections(collection) ON DELETE CASCADE not valid;

alter table "directus"."directus_versions" validate constraint "directus_versions_collection_foreign";

alter table "directus"."directus_versions" add constraint "directus_versions_user_created_foreign" FOREIGN KEY (user_created) REFERENCES directus.directus_users(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_versions" validate constraint "directus_versions_user_created_foreign";

alter table "directus"."directus_versions" add constraint "directus_versions_user_updated_foreign" FOREIGN KEY (user_updated) REFERENCES directus.directus_users(id) not valid;

alter table "directus"."directus_versions" validate constraint "directus_versions_user_updated_foreign";

alter table "directus"."directus_webhooks" add constraint "directus_webhooks_migrated_flow_foreign" FOREIGN KEY (migrated_flow) REFERENCES directus.directus_flows(id) ON DELETE SET NULL not valid;

alter table "directus"."directus_webhooks" validate constraint "directus_webhooks_migrated_flow_foreign";

grant delete on table "directus"."directus_access" to "anon";

grant insert on table "directus"."directus_access" to "anon";

grant references on table "directus"."directus_access" to "anon";

grant select on table "directus"."directus_access" to "anon";

grant trigger on table "directus"."directus_access" to "anon";

grant truncate on table "directus"."directus_access" to "anon";

grant update on table "directus"."directus_access" to "anon";

grant delete on table "directus"."directus_access" to "authenticated";

grant insert on table "directus"."directus_access" to "authenticated";

grant references on table "directus"."directus_access" to "authenticated";

grant select on table "directus"."directus_access" to "authenticated";

grant trigger on table "directus"."directus_access" to "authenticated";

grant truncate on table "directus"."directus_access" to "authenticated";

grant update on table "directus"."directus_access" to "authenticated";

grant delete on table "directus"."directus_access" to "service_role";

grant insert on table "directus"."directus_access" to "service_role";

grant references on table "directus"."directus_access" to "service_role";

grant select on table "directus"."directus_access" to "service_role";

grant trigger on table "directus"."directus_access" to "service_role";

grant truncate on table "directus"."directus_access" to "service_role";

grant update on table "directus"."directus_access" to "service_role";

grant delete on table "directus"."directus_activity" to "anon";

grant insert on table "directus"."directus_activity" to "anon";

grant references on table "directus"."directus_activity" to "anon";

grant select on table "directus"."directus_activity" to "anon";

grant trigger on table "directus"."directus_activity" to "anon";

grant truncate on table "directus"."directus_activity" to "anon";

grant update on table "directus"."directus_activity" to "anon";

grant delete on table "directus"."directus_activity" to "authenticated";

grant insert on table "directus"."directus_activity" to "authenticated";

grant references on table "directus"."directus_activity" to "authenticated";

grant select on table "directus"."directus_activity" to "authenticated";

grant trigger on table "directus"."directus_activity" to "authenticated";

grant truncate on table "directus"."directus_activity" to "authenticated";

grant update on table "directus"."directus_activity" to "authenticated";

grant delete on table "directus"."directus_activity" to "service_role";

grant insert on table "directus"."directus_activity" to "service_role";

grant references on table "directus"."directus_activity" to "service_role";

grant select on table "directus"."directus_activity" to "service_role";

grant trigger on table "directus"."directus_activity" to "service_role";

grant truncate on table "directus"."directus_activity" to "service_role";

grant update on table "directus"."directus_activity" to "service_role";

grant delete on table "directus"."directus_collections" to "anon";

grant insert on table "directus"."directus_collections" to "anon";

grant references on table "directus"."directus_collections" to "anon";

grant select on table "directus"."directus_collections" to "anon";

grant trigger on table "directus"."directus_collections" to "anon";

grant truncate on table "directus"."directus_collections" to "anon";

grant update on table "directus"."directus_collections" to "anon";

grant delete on table "directus"."directus_collections" to "authenticated";

grant insert on table "directus"."directus_collections" to "authenticated";

grant references on table "directus"."directus_collections" to "authenticated";

grant select on table "directus"."directus_collections" to "authenticated";

grant trigger on table "directus"."directus_collections" to "authenticated";

grant truncate on table "directus"."directus_collections" to "authenticated";

grant update on table "directus"."directus_collections" to "authenticated";

grant delete on table "directus"."directus_collections" to "service_role";

grant insert on table "directus"."directus_collections" to "service_role";

grant references on table "directus"."directus_collections" to "service_role";

grant select on table "directus"."directus_collections" to "service_role";

grant trigger on table "directus"."directus_collections" to "service_role";

grant truncate on table "directus"."directus_collections" to "service_role";

grant update on table "directus"."directus_collections" to "service_role";

grant delete on table "directus"."directus_comments" to "anon";

grant insert on table "directus"."directus_comments" to "anon";

grant references on table "directus"."directus_comments" to "anon";

grant select on table "directus"."directus_comments" to "anon";

grant trigger on table "directus"."directus_comments" to "anon";

grant truncate on table "directus"."directus_comments" to "anon";

grant update on table "directus"."directus_comments" to "anon";

grant delete on table "directus"."directus_comments" to "authenticated";

grant insert on table "directus"."directus_comments" to "authenticated";

grant references on table "directus"."directus_comments" to "authenticated";

grant select on table "directus"."directus_comments" to "authenticated";

grant trigger on table "directus"."directus_comments" to "authenticated";

grant truncate on table "directus"."directus_comments" to "authenticated";

grant update on table "directus"."directus_comments" to "authenticated";

grant delete on table "directus"."directus_comments" to "service_role";

grant insert on table "directus"."directus_comments" to "service_role";

grant references on table "directus"."directus_comments" to "service_role";

grant select on table "directus"."directus_comments" to "service_role";

grant trigger on table "directus"."directus_comments" to "service_role";

grant truncate on table "directus"."directus_comments" to "service_role";

grant update on table "directus"."directus_comments" to "service_role";

grant delete on table "directus"."directus_dashboards" to "anon";

grant insert on table "directus"."directus_dashboards" to "anon";

grant references on table "directus"."directus_dashboards" to "anon";

grant select on table "directus"."directus_dashboards" to "anon";

grant trigger on table "directus"."directus_dashboards" to "anon";

grant truncate on table "directus"."directus_dashboards" to "anon";

grant update on table "directus"."directus_dashboards" to "anon";

grant delete on table "directus"."directus_dashboards" to "authenticated";

grant insert on table "directus"."directus_dashboards" to "authenticated";

grant references on table "directus"."directus_dashboards" to "authenticated";

grant select on table "directus"."directus_dashboards" to "authenticated";

grant trigger on table "directus"."directus_dashboards" to "authenticated";

grant truncate on table "directus"."directus_dashboards" to "authenticated";

grant update on table "directus"."directus_dashboards" to "authenticated";

grant delete on table "directus"."directus_dashboards" to "service_role";

grant insert on table "directus"."directus_dashboards" to "service_role";

grant references on table "directus"."directus_dashboards" to "service_role";

grant select on table "directus"."directus_dashboards" to "service_role";

grant trigger on table "directus"."directus_dashboards" to "service_role";

grant truncate on table "directus"."directus_dashboards" to "service_role";

grant update on table "directus"."directus_dashboards" to "service_role";

grant delete on table "directus"."directus_extensions" to "anon";

grant insert on table "directus"."directus_extensions" to "anon";

grant references on table "directus"."directus_extensions" to "anon";

grant select on table "directus"."directus_extensions" to "anon";

grant trigger on table "directus"."directus_extensions" to "anon";

grant truncate on table "directus"."directus_extensions" to "anon";

grant update on table "directus"."directus_extensions" to "anon";

grant delete on table "directus"."directus_extensions" to "authenticated";

grant insert on table "directus"."directus_extensions" to "authenticated";

grant references on table "directus"."directus_extensions" to "authenticated";

grant select on table "directus"."directus_extensions" to "authenticated";

grant trigger on table "directus"."directus_extensions" to "authenticated";

grant truncate on table "directus"."directus_extensions" to "authenticated";

grant update on table "directus"."directus_extensions" to "authenticated";

grant delete on table "directus"."directus_extensions" to "service_role";

grant insert on table "directus"."directus_extensions" to "service_role";

grant references on table "directus"."directus_extensions" to "service_role";

grant select on table "directus"."directus_extensions" to "service_role";

grant trigger on table "directus"."directus_extensions" to "service_role";

grant truncate on table "directus"."directus_extensions" to "service_role";

grant update on table "directus"."directus_extensions" to "service_role";

grant delete on table "directus"."directus_fields" to "anon";

grant insert on table "directus"."directus_fields" to "anon";

grant references on table "directus"."directus_fields" to "anon";

grant select on table "directus"."directus_fields" to "anon";

grant trigger on table "directus"."directus_fields" to "anon";

grant truncate on table "directus"."directus_fields" to "anon";

grant update on table "directus"."directus_fields" to "anon";

grant delete on table "directus"."directus_fields" to "authenticated";

grant insert on table "directus"."directus_fields" to "authenticated";

grant references on table "directus"."directus_fields" to "authenticated";

grant select on table "directus"."directus_fields" to "authenticated";

grant trigger on table "directus"."directus_fields" to "authenticated";

grant truncate on table "directus"."directus_fields" to "authenticated";

grant update on table "directus"."directus_fields" to "authenticated";

grant delete on table "directus"."directus_fields" to "service_role";

grant insert on table "directus"."directus_fields" to "service_role";

grant references on table "directus"."directus_fields" to "service_role";

grant select on table "directus"."directus_fields" to "service_role";

grant trigger on table "directus"."directus_fields" to "service_role";

grant truncate on table "directus"."directus_fields" to "service_role";

grant update on table "directus"."directus_fields" to "service_role";

grant delete on table "directus"."directus_files" to "anon";

grant insert on table "directus"."directus_files" to "anon";

grant references on table "directus"."directus_files" to "anon";

grant select on table "directus"."directus_files" to "anon";

grant trigger on table "directus"."directus_files" to "anon";

grant truncate on table "directus"."directus_files" to "anon";

grant update on table "directus"."directus_files" to "anon";

grant delete on table "directus"."directus_files" to "authenticated";

grant insert on table "directus"."directus_files" to "authenticated";

grant references on table "directus"."directus_files" to "authenticated";

grant select on table "directus"."directus_files" to "authenticated";

grant trigger on table "directus"."directus_files" to "authenticated";

grant truncate on table "directus"."directus_files" to "authenticated";

grant update on table "directus"."directus_files" to "authenticated";

grant delete on table "directus"."directus_files" to "service_role";

grant insert on table "directus"."directus_files" to "service_role";

grant references on table "directus"."directus_files" to "service_role";

grant select on table "directus"."directus_files" to "service_role";

grant trigger on table "directus"."directus_files" to "service_role";

grant truncate on table "directus"."directus_files" to "service_role";

grant update on table "directus"."directus_files" to "service_role";

grant delete on table "directus"."directus_flows" to "anon";

grant insert on table "directus"."directus_flows" to "anon";

grant references on table "directus"."directus_flows" to "anon";

grant select on table "directus"."directus_flows" to "anon";

grant trigger on table "directus"."directus_flows" to "anon";

grant truncate on table "directus"."directus_flows" to "anon";

grant update on table "directus"."directus_flows" to "anon";

grant delete on table "directus"."directus_flows" to "authenticated";

grant insert on table "directus"."directus_flows" to "authenticated";

grant references on table "directus"."directus_flows" to "authenticated";

grant select on table "directus"."directus_flows" to "authenticated";

grant trigger on table "directus"."directus_flows" to "authenticated";

grant truncate on table "directus"."directus_flows" to "authenticated";

grant update on table "directus"."directus_flows" to "authenticated";

grant delete on table "directus"."directus_flows" to "service_role";

grant insert on table "directus"."directus_flows" to "service_role";

grant references on table "directus"."directus_flows" to "service_role";

grant select on table "directus"."directus_flows" to "service_role";

grant trigger on table "directus"."directus_flows" to "service_role";

grant truncate on table "directus"."directus_flows" to "service_role";

grant update on table "directus"."directus_flows" to "service_role";

grant delete on table "directus"."directus_folders" to "anon";

grant insert on table "directus"."directus_folders" to "anon";

grant references on table "directus"."directus_folders" to "anon";

grant select on table "directus"."directus_folders" to "anon";

grant trigger on table "directus"."directus_folders" to "anon";

grant truncate on table "directus"."directus_folders" to "anon";

grant update on table "directus"."directus_folders" to "anon";

grant delete on table "directus"."directus_folders" to "authenticated";

grant insert on table "directus"."directus_folders" to "authenticated";

grant references on table "directus"."directus_folders" to "authenticated";

grant select on table "directus"."directus_folders" to "authenticated";

grant trigger on table "directus"."directus_folders" to "authenticated";

grant truncate on table "directus"."directus_folders" to "authenticated";

grant update on table "directus"."directus_folders" to "authenticated";

grant delete on table "directus"."directus_folders" to "service_role";

grant insert on table "directus"."directus_folders" to "service_role";

grant references on table "directus"."directus_folders" to "service_role";

grant select on table "directus"."directus_folders" to "service_role";

grant trigger on table "directus"."directus_folders" to "service_role";

grant truncate on table "directus"."directus_folders" to "service_role";

grant update on table "directus"."directus_folders" to "service_role";

grant delete on table "directus"."directus_migrations" to "anon";

grant insert on table "directus"."directus_migrations" to "anon";

grant references on table "directus"."directus_migrations" to "anon";

grant select on table "directus"."directus_migrations" to "anon";

grant trigger on table "directus"."directus_migrations" to "anon";

grant truncate on table "directus"."directus_migrations" to "anon";

grant update on table "directus"."directus_migrations" to "anon";

grant delete on table "directus"."directus_migrations" to "authenticated";

grant insert on table "directus"."directus_migrations" to "authenticated";

grant references on table "directus"."directus_migrations" to "authenticated";

grant select on table "directus"."directus_migrations" to "authenticated";

grant trigger on table "directus"."directus_migrations" to "authenticated";

grant truncate on table "directus"."directus_migrations" to "authenticated";

grant update on table "directus"."directus_migrations" to "authenticated";

grant delete on table "directus"."directus_migrations" to "service_role";

grant insert on table "directus"."directus_migrations" to "service_role";

grant references on table "directus"."directus_migrations" to "service_role";

grant select on table "directus"."directus_migrations" to "service_role";

grant trigger on table "directus"."directus_migrations" to "service_role";

grant truncate on table "directus"."directus_migrations" to "service_role";

grant update on table "directus"."directus_migrations" to "service_role";

grant delete on table "directus"."directus_notifications" to "anon";

grant insert on table "directus"."directus_notifications" to "anon";

grant references on table "directus"."directus_notifications" to "anon";

grant select on table "directus"."directus_notifications" to "anon";

grant trigger on table "directus"."directus_notifications" to "anon";

grant truncate on table "directus"."directus_notifications" to "anon";

grant update on table "directus"."directus_notifications" to "anon";

grant delete on table "directus"."directus_notifications" to "authenticated";

grant insert on table "directus"."directus_notifications" to "authenticated";

grant references on table "directus"."directus_notifications" to "authenticated";

grant select on table "directus"."directus_notifications" to "authenticated";

grant trigger on table "directus"."directus_notifications" to "authenticated";

grant truncate on table "directus"."directus_notifications" to "authenticated";

grant update on table "directus"."directus_notifications" to "authenticated";

grant delete on table "directus"."directus_notifications" to "service_role";

grant insert on table "directus"."directus_notifications" to "service_role";

grant references on table "directus"."directus_notifications" to "service_role";

grant select on table "directus"."directus_notifications" to "service_role";

grant trigger on table "directus"."directus_notifications" to "service_role";

grant truncate on table "directus"."directus_notifications" to "service_role";

grant update on table "directus"."directus_notifications" to "service_role";

grant delete on table "directus"."directus_operations" to "anon";

grant insert on table "directus"."directus_operations" to "anon";

grant references on table "directus"."directus_operations" to "anon";

grant select on table "directus"."directus_operations" to "anon";

grant trigger on table "directus"."directus_operations" to "anon";

grant truncate on table "directus"."directus_operations" to "anon";

grant update on table "directus"."directus_operations" to "anon";

grant delete on table "directus"."directus_operations" to "authenticated";

grant insert on table "directus"."directus_operations" to "authenticated";

grant references on table "directus"."directus_operations" to "authenticated";

grant select on table "directus"."directus_operations" to "authenticated";

grant trigger on table "directus"."directus_operations" to "authenticated";

grant truncate on table "directus"."directus_operations" to "authenticated";

grant update on table "directus"."directus_operations" to "authenticated";

grant delete on table "directus"."directus_operations" to "service_role";

grant insert on table "directus"."directus_operations" to "service_role";

grant references on table "directus"."directus_operations" to "service_role";

grant select on table "directus"."directus_operations" to "service_role";

grant trigger on table "directus"."directus_operations" to "service_role";

grant truncate on table "directus"."directus_operations" to "service_role";

grant update on table "directus"."directus_operations" to "service_role";

grant delete on table "directus"."directus_panels" to "anon";

grant insert on table "directus"."directus_panels" to "anon";

grant references on table "directus"."directus_panels" to "anon";

grant select on table "directus"."directus_panels" to "anon";

grant trigger on table "directus"."directus_panels" to "anon";

grant truncate on table "directus"."directus_panels" to "anon";

grant update on table "directus"."directus_panels" to "anon";

grant delete on table "directus"."directus_panels" to "authenticated";

grant insert on table "directus"."directus_panels" to "authenticated";

grant references on table "directus"."directus_panels" to "authenticated";

grant select on table "directus"."directus_panels" to "authenticated";

grant trigger on table "directus"."directus_panels" to "authenticated";

grant truncate on table "directus"."directus_panels" to "authenticated";

grant update on table "directus"."directus_panels" to "authenticated";

grant delete on table "directus"."directus_panels" to "service_role";

grant insert on table "directus"."directus_panels" to "service_role";

grant references on table "directus"."directus_panels" to "service_role";

grant select on table "directus"."directus_panels" to "service_role";

grant trigger on table "directus"."directus_panels" to "service_role";

grant truncate on table "directus"."directus_panels" to "service_role";

grant update on table "directus"."directus_panels" to "service_role";

grant delete on table "directus"."directus_permissions" to "anon";

grant insert on table "directus"."directus_permissions" to "anon";

grant references on table "directus"."directus_permissions" to "anon";

grant select on table "directus"."directus_permissions" to "anon";

grant trigger on table "directus"."directus_permissions" to "anon";

grant truncate on table "directus"."directus_permissions" to "anon";

grant update on table "directus"."directus_permissions" to "anon";

grant delete on table "directus"."directus_permissions" to "authenticated";

grant insert on table "directus"."directus_permissions" to "authenticated";

grant references on table "directus"."directus_permissions" to "authenticated";

grant select on table "directus"."directus_permissions" to "authenticated";

grant trigger on table "directus"."directus_permissions" to "authenticated";

grant truncate on table "directus"."directus_permissions" to "authenticated";

grant update on table "directus"."directus_permissions" to "authenticated";

grant delete on table "directus"."directus_permissions" to "service_role";

grant insert on table "directus"."directus_permissions" to "service_role";

grant references on table "directus"."directus_permissions" to "service_role";

grant select on table "directus"."directus_permissions" to "service_role";

grant trigger on table "directus"."directus_permissions" to "service_role";

grant truncate on table "directus"."directus_permissions" to "service_role";

grant update on table "directus"."directus_permissions" to "service_role";

grant delete on table "directus"."directus_policies" to "anon";

grant insert on table "directus"."directus_policies" to "anon";

grant references on table "directus"."directus_policies" to "anon";

grant select on table "directus"."directus_policies" to "anon";

grant trigger on table "directus"."directus_policies" to "anon";

grant truncate on table "directus"."directus_policies" to "anon";

grant update on table "directus"."directus_policies" to "anon";

grant delete on table "directus"."directus_policies" to "authenticated";

grant insert on table "directus"."directus_policies" to "authenticated";

grant references on table "directus"."directus_policies" to "authenticated";

grant select on table "directus"."directus_policies" to "authenticated";

grant trigger on table "directus"."directus_policies" to "authenticated";

grant truncate on table "directus"."directus_policies" to "authenticated";

grant update on table "directus"."directus_policies" to "authenticated";

grant delete on table "directus"."directus_policies" to "service_role";

grant insert on table "directus"."directus_policies" to "service_role";

grant references on table "directus"."directus_policies" to "service_role";

grant select on table "directus"."directus_policies" to "service_role";

grant trigger on table "directus"."directus_policies" to "service_role";

grant truncate on table "directus"."directus_policies" to "service_role";

grant update on table "directus"."directus_policies" to "service_role";

grant delete on table "directus"."directus_presets" to "anon";

grant insert on table "directus"."directus_presets" to "anon";

grant references on table "directus"."directus_presets" to "anon";

grant select on table "directus"."directus_presets" to "anon";

grant trigger on table "directus"."directus_presets" to "anon";

grant truncate on table "directus"."directus_presets" to "anon";

grant update on table "directus"."directus_presets" to "anon";

grant delete on table "directus"."directus_presets" to "authenticated";

grant insert on table "directus"."directus_presets" to "authenticated";

grant references on table "directus"."directus_presets" to "authenticated";

grant select on table "directus"."directus_presets" to "authenticated";

grant trigger on table "directus"."directus_presets" to "authenticated";

grant truncate on table "directus"."directus_presets" to "authenticated";

grant update on table "directus"."directus_presets" to "authenticated";

grant delete on table "directus"."directus_presets" to "service_role";

grant insert on table "directus"."directus_presets" to "service_role";

grant references on table "directus"."directus_presets" to "service_role";

grant select on table "directus"."directus_presets" to "service_role";

grant trigger on table "directus"."directus_presets" to "service_role";

grant truncate on table "directus"."directus_presets" to "service_role";

grant update on table "directus"."directus_presets" to "service_role";

grant delete on table "directus"."directus_relations" to "anon";

grant insert on table "directus"."directus_relations" to "anon";

grant references on table "directus"."directus_relations" to "anon";

grant select on table "directus"."directus_relations" to "anon";

grant trigger on table "directus"."directus_relations" to "anon";

grant truncate on table "directus"."directus_relations" to "anon";

grant update on table "directus"."directus_relations" to "anon";

grant delete on table "directus"."directus_relations" to "authenticated";

grant insert on table "directus"."directus_relations" to "authenticated";

grant references on table "directus"."directus_relations" to "authenticated";

grant select on table "directus"."directus_relations" to "authenticated";

grant trigger on table "directus"."directus_relations" to "authenticated";

grant truncate on table "directus"."directus_relations" to "authenticated";

grant update on table "directus"."directus_relations" to "authenticated";

grant delete on table "directus"."directus_relations" to "service_role";

grant insert on table "directus"."directus_relations" to "service_role";

grant references on table "directus"."directus_relations" to "service_role";

grant select on table "directus"."directus_relations" to "service_role";

grant trigger on table "directus"."directus_relations" to "service_role";

grant truncate on table "directus"."directus_relations" to "service_role";

grant update on table "directus"."directus_relations" to "service_role";

grant delete on table "directus"."directus_revisions" to "anon";

grant insert on table "directus"."directus_revisions" to "anon";

grant references on table "directus"."directus_revisions" to "anon";

grant select on table "directus"."directus_revisions" to "anon";

grant trigger on table "directus"."directus_revisions" to "anon";

grant truncate on table "directus"."directus_revisions" to "anon";

grant update on table "directus"."directus_revisions" to "anon";

grant delete on table "directus"."directus_revisions" to "authenticated";

grant insert on table "directus"."directus_revisions" to "authenticated";

grant references on table "directus"."directus_revisions" to "authenticated";

grant select on table "directus"."directus_revisions" to "authenticated";

grant trigger on table "directus"."directus_revisions" to "authenticated";

grant truncate on table "directus"."directus_revisions" to "authenticated";

grant update on table "directus"."directus_revisions" to "authenticated";

grant delete on table "directus"."directus_revisions" to "service_role";

grant insert on table "directus"."directus_revisions" to "service_role";

grant references on table "directus"."directus_revisions" to "service_role";

grant select on table "directus"."directus_revisions" to "service_role";

grant trigger on table "directus"."directus_revisions" to "service_role";

grant truncate on table "directus"."directus_revisions" to "service_role";

grant update on table "directus"."directus_revisions" to "service_role";

grant delete on table "directus"."directus_roles" to "anon";

grant insert on table "directus"."directus_roles" to "anon";

grant references on table "directus"."directus_roles" to "anon";

grant select on table "directus"."directus_roles" to "anon";

grant trigger on table "directus"."directus_roles" to "anon";

grant truncate on table "directus"."directus_roles" to "anon";

grant update on table "directus"."directus_roles" to "anon";

grant delete on table "directus"."directus_roles" to "authenticated";

grant insert on table "directus"."directus_roles" to "authenticated";

grant references on table "directus"."directus_roles" to "authenticated";

grant select on table "directus"."directus_roles" to "authenticated";

grant trigger on table "directus"."directus_roles" to "authenticated";

grant truncate on table "directus"."directus_roles" to "authenticated";

grant update on table "directus"."directus_roles" to "authenticated";

grant delete on table "directus"."directus_roles" to "service_role";

grant insert on table "directus"."directus_roles" to "service_role";

grant references on table "directus"."directus_roles" to "service_role";

grant select on table "directus"."directus_roles" to "service_role";

grant trigger on table "directus"."directus_roles" to "service_role";

grant truncate on table "directus"."directus_roles" to "service_role";

grant update on table "directus"."directus_roles" to "service_role";

grant delete on table "directus"."directus_sessions" to "anon";

grant insert on table "directus"."directus_sessions" to "anon";

grant references on table "directus"."directus_sessions" to "anon";

grant select on table "directus"."directus_sessions" to "anon";

grant trigger on table "directus"."directus_sessions" to "anon";

grant truncate on table "directus"."directus_sessions" to "anon";

grant update on table "directus"."directus_sessions" to "anon";

grant delete on table "directus"."directus_sessions" to "authenticated";

grant insert on table "directus"."directus_sessions" to "authenticated";

grant references on table "directus"."directus_sessions" to "authenticated";

grant select on table "directus"."directus_sessions" to "authenticated";

grant trigger on table "directus"."directus_sessions" to "authenticated";

grant truncate on table "directus"."directus_sessions" to "authenticated";

grant update on table "directus"."directus_sessions" to "authenticated";

grant delete on table "directus"."directus_sessions" to "service_role";

grant insert on table "directus"."directus_sessions" to "service_role";

grant references on table "directus"."directus_sessions" to "service_role";

grant select on table "directus"."directus_sessions" to "service_role";

grant trigger on table "directus"."directus_sessions" to "service_role";

grant truncate on table "directus"."directus_sessions" to "service_role";

grant update on table "directus"."directus_sessions" to "service_role";

grant delete on table "directus"."directus_settings" to "anon";

grant insert on table "directus"."directus_settings" to "anon";

grant references on table "directus"."directus_settings" to "anon";

grant select on table "directus"."directus_settings" to "anon";

grant trigger on table "directus"."directus_settings" to "anon";

grant truncate on table "directus"."directus_settings" to "anon";

grant update on table "directus"."directus_settings" to "anon";

grant delete on table "directus"."directus_settings" to "authenticated";

grant insert on table "directus"."directus_settings" to "authenticated";

grant references on table "directus"."directus_settings" to "authenticated";

grant select on table "directus"."directus_settings" to "authenticated";

grant trigger on table "directus"."directus_settings" to "authenticated";

grant truncate on table "directus"."directus_settings" to "authenticated";

grant update on table "directus"."directus_settings" to "authenticated";

grant delete on table "directus"."directus_settings" to "service_role";

grant insert on table "directus"."directus_settings" to "service_role";

grant references on table "directus"."directus_settings" to "service_role";

grant select on table "directus"."directus_settings" to "service_role";

grant trigger on table "directus"."directus_settings" to "service_role";

grant truncate on table "directus"."directus_settings" to "service_role";

grant update on table "directus"."directus_settings" to "service_role";

grant delete on table "directus"."directus_shares" to "anon";

grant insert on table "directus"."directus_shares" to "anon";

grant references on table "directus"."directus_shares" to "anon";

grant select on table "directus"."directus_shares" to "anon";

grant trigger on table "directus"."directus_shares" to "anon";

grant truncate on table "directus"."directus_shares" to "anon";

grant update on table "directus"."directus_shares" to "anon";

grant delete on table "directus"."directus_shares" to "authenticated";

grant insert on table "directus"."directus_shares" to "authenticated";

grant references on table "directus"."directus_shares" to "authenticated";

grant select on table "directus"."directus_shares" to "authenticated";

grant trigger on table "directus"."directus_shares" to "authenticated";

grant truncate on table "directus"."directus_shares" to "authenticated";

grant update on table "directus"."directus_shares" to "authenticated";

grant delete on table "directus"."directus_shares" to "service_role";

grant insert on table "directus"."directus_shares" to "service_role";

grant references on table "directus"."directus_shares" to "service_role";

grant select on table "directus"."directus_shares" to "service_role";

grant trigger on table "directus"."directus_shares" to "service_role";

grant truncate on table "directus"."directus_shares" to "service_role";

grant update on table "directus"."directus_shares" to "service_role";

grant delete on table "directus"."directus_translations" to "anon";

grant insert on table "directus"."directus_translations" to "anon";

grant references on table "directus"."directus_translations" to "anon";

grant select on table "directus"."directus_translations" to "anon";

grant trigger on table "directus"."directus_translations" to "anon";

grant truncate on table "directus"."directus_translations" to "anon";

grant update on table "directus"."directus_translations" to "anon";

grant delete on table "directus"."directus_translations" to "authenticated";

grant insert on table "directus"."directus_translations" to "authenticated";

grant references on table "directus"."directus_translations" to "authenticated";

grant select on table "directus"."directus_translations" to "authenticated";

grant trigger on table "directus"."directus_translations" to "authenticated";

grant truncate on table "directus"."directus_translations" to "authenticated";

grant update on table "directus"."directus_translations" to "authenticated";

grant delete on table "directus"."directus_translations" to "service_role";

grant insert on table "directus"."directus_translations" to "service_role";

grant references on table "directus"."directus_translations" to "service_role";

grant select on table "directus"."directus_translations" to "service_role";

grant trigger on table "directus"."directus_translations" to "service_role";

grant truncate on table "directus"."directus_translations" to "service_role";

grant update on table "directus"."directus_translations" to "service_role";

grant delete on table "directus"."directus_users" to "anon";

grant insert on table "directus"."directus_users" to "anon";

grant references on table "directus"."directus_users" to "anon";

grant select on table "directus"."directus_users" to "anon";

grant trigger on table "directus"."directus_users" to "anon";

grant truncate on table "directus"."directus_users" to "anon";

grant update on table "directus"."directus_users" to "anon";

grant delete on table "directus"."directus_users" to "authenticated";

grant insert on table "directus"."directus_users" to "authenticated";

grant references on table "directus"."directus_users" to "authenticated";

grant select on table "directus"."directus_users" to "authenticated";

grant trigger on table "directus"."directus_users" to "authenticated";

grant truncate on table "directus"."directus_users" to "authenticated";

grant update on table "directus"."directus_users" to "authenticated";

grant delete on table "directus"."directus_users" to "service_role";

grant insert on table "directus"."directus_users" to "service_role";

grant references on table "directus"."directus_users" to "service_role";

grant select on table "directus"."directus_users" to "service_role";

grant trigger on table "directus"."directus_users" to "service_role";

grant truncate on table "directus"."directus_users" to "service_role";

grant update on table "directus"."directus_users" to "service_role";

grant delete on table "directus"."directus_versions" to "anon";

grant insert on table "directus"."directus_versions" to "anon";

grant references on table "directus"."directus_versions" to "anon";

grant select on table "directus"."directus_versions" to "anon";

grant trigger on table "directus"."directus_versions" to "anon";

grant truncate on table "directus"."directus_versions" to "anon";

grant update on table "directus"."directus_versions" to "anon";

grant delete on table "directus"."directus_versions" to "authenticated";

grant insert on table "directus"."directus_versions" to "authenticated";

grant references on table "directus"."directus_versions" to "authenticated";

grant select on table "directus"."directus_versions" to "authenticated";

grant trigger on table "directus"."directus_versions" to "authenticated";

grant truncate on table "directus"."directus_versions" to "authenticated";

grant update on table "directus"."directus_versions" to "authenticated";

grant delete on table "directus"."directus_versions" to "service_role";

grant insert on table "directus"."directus_versions" to "service_role";

grant references on table "directus"."directus_versions" to "service_role";

grant select on table "directus"."directus_versions" to "service_role";

grant trigger on table "directus"."directus_versions" to "service_role";

grant truncate on table "directus"."directus_versions" to "service_role";

grant update on table "directus"."directus_versions" to "service_role";

grant delete on table "directus"."directus_webhooks" to "anon";

grant insert on table "directus"."directus_webhooks" to "anon";

grant references on table "directus"."directus_webhooks" to "anon";

grant select on table "directus"."directus_webhooks" to "anon";

grant trigger on table "directus"."directus_webhooks" to "anon";

grant truncate on table "directus"."directus_webhooks" to "anon";

grant update on table "directus"."directus_webhooks" to "anon";

grant delete on table "directus"."directus_webhooks" to "authenticated";

grant insert on table "directus"."directus_webhooks" to "authenticated";

grant references on table "directus"."directus_webhooks" to "authenticated";

grant select on table "directus"."directus_webhooks" to "authenticated";

grant trigger on table "directus"."directus_webhooks" to "authenticated";

grant truncate on table "directus"."directus_webhooks" to "authenticated";

grant update on table "directus"."directus_webhooks" to "authenticated";

grant delete on table "directus"."directus_webhooks" to "service_role";

grant insert on table "directus"."directus_webhooks" to "service_role";

grant references on table "directus"."directus_webhooks" to "service_role";

grant select on table "directus"."directus_webhooks" to "service_role";

grant trigger on table "directus"."directus_webhooks" to "service_role";

grant truncate on table "directus"."directus_webhooks" to "service_role";

grant update on table "directus"."directus_webhooks" to "service_role";


