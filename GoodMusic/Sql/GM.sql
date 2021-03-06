--USE [master]; DROP DATABASE [GoodMusic]; CREATE DATABASE [GoodMusic];
USE [GoodMusic]
GO

SET NOCOUNT ON
GO

IF OBJECT_ID(N'apiPlaylist', N'P') IS NOT NULL DROP PROCEDURE [apiPlaylist]
IF OBJECT_ID(N'apiPlaylistParameters', N'P') IS NOT NULL DROP PROCEDURE [apiPlaylistParameters]
IF OBJECT_ID(N'apiSearch', N'P') IS NOT NULL DROP PROCEDURE [apiSearch]
IF OBJECT_ID(N'apiExport', N'P') IS NOT NULL DROP PROCEDURE [apiExport]
IF OBJECT_ID(N'apiImport', N'P') IS NOT NULL DROP PROCEDURE [apiImport]
IF OBJECT_ID(N'apiLogin', N'P') IS NOT NULL DROP PROCEDURE [apiLogin]
-- Base Tables
IF OBJECT_ID(N'favourite', N'U') IS NOT NULL DROP TABLE [favourite]
IF OBJECT_ID(N'review', N'U') IS NOT NULL DROP TABLE [review]
IF OBJECT_ID(N'video', N'U') IS NOT NULL DROP TABLE [video]
IF OBJECT_ID(N'user', N'U') IS NOT NULL DROP TABLE [user]
IF OBJECT_ID(N'style', N'U') IS NOT NULL DROP TABLE [style]
IF OBJECT_ID(N'genre', N'U') IS NOT NULL DROP TABLE [genre]
IF OBJECT_ID(N'gender', N'U') IS NOT NULL DROP TABLE [gender]
IF OBJECT_ID(N'country', N'U') IS NOT NULL DROP TABLE [country]
GO

CREATE TABLE [country] (
	[id] NCHAR(2) NOT NULL,
	[name] NVARCHAR(255) NOT NULL,
	CONSTRAINT [pk_country] PRIMARY KEY NONCLUSTERED ([id]),
	CONSTRAINT [uq_country_name] UNIQUE CLUSTERED ([name])
)
GO

INSERT INTO [country] ([id], [name])
VALUES
	(N'AD', N'Andorra'),
	(N'AE', N'United Arab Emirates'),
	(N'AF', N'Afghanistan'),
	(N'AG', N'Antigua and Barbuda'),
	(N'AI', N'Anguilla'),
	(N'AL', N'Albania'),
	(N'AM', N'Armenia'),
	(N'AO', N'Angola'),
	(N'AQ', N'Antarctica'),
	(N'AR', N'Argentina'),
	(N'AS', N'American Samoa'),
	(N'AT', N'Austria'),
	(N'AU', N'Australia'),
	(N'AW', N'Aruba'),
	(N'AX', N'�land Islands'),
	(N'AZ', N'Azerbaijan'),
	(N'BA', N'Bosnia and Herzegovina'),
	(N'BB', N'Barbados'),
	(N'BD', N'Bangladesh'),
	(N'BE', N'Belgium'),
	(N'BF', N'Burkina Faso'),
	(N'BG', N'Bulgaria'),
	(N'BH', N'Bahrain'),
	(N'BI', N'Burundi'),
	(N'BJ', N'Benin'),
	(N'BL', N'Saint Barth�lemy'),
	(N'BM', N'Bermuda'),
	(N'BN', N'Brunei Darussalam'),
	(N'BO', N'Bolivia, Plurinational State of'),
	(N'BQ', N'Bonaire, Sint Eustatius and Saba'),
	(N'BR', N'Brazil'),
	(N'BS', N'Bahamas'),
	(N'BT', N'Bhutan'),
	(N'BV', N'Bouvet Island'),
	(N'BW', N'Botswana'),
	(N'BY', N'Belarus'),
	(N'BZ', N'Belize'),
	(N'CA', N'Canada'),
	(N'CC', N'Cocos (Keeling) Islands'),
	(N'CD', N'Congo, the Democratic Republic of the'),
	(N'CF', N'Central African Republic'),
	(N'CG', N'Congo'),
	(N'CH', N'Switzerland'),
	(N'CI', N'C�te d''Ivoire'),
	(N'CK', N'Cook Islands'),
	(N'CL', N'Chile'),
	(N'CM', N'Cameroon'),
	(N'CN', N'China'),
	(N'CO', N'Colombia'),
	(N'CR', N'Costa Rica'),
	(N'CU', N'Cuba'),
	(N'CV', N'Cabo Verde'),
	(N'CW', N'Cura�ao'),
	(N'CX', N'Christmas Island'),
	(N'CY', N'Cyprus'),
	(N'CZ', N'Czech Republic'),
	(N'DE', N'Germany'),
	(N'DJ', N'Djibouti'),
	(N'DK', N'Denmark'),
	(N'DM', N'Dominica'),
	(N'DO', N'Dominican Republic'),
	(N'DZ', N'Algeria'),
	(N'EC', N'Ecuador'),
	(N'EE', N'Estonia'),
	(N'EG', N'Egypt'),
	(N'EH', N'Western Sahara'),
	(N'ER', N'Eritrea'),
	(N'ES', N'Spain'),
	(N'ET', N'Ethiopia'),
	(N'FI', N'Finland'),
	(N'FJ', N'Fiji'),
	(N'FK', N'Falkland Islands (Malvinas)'),
	(N'FM', N'Micronesia, Federated States of'),
	(N'FO', N'Faroe Islands'),
	(N'FR', N'France'),
	(N'GA', N'Gabon'),
	(N'GB', N'United Kingdom of Great Britain and Northern Ireland'),
	(N'GD', N'Grenada'),
	(N'GE', N'Georgia'),
	(N'GF', N'French Guiana'),
	(N'GG', N'Guernsey'),
	(N'GH', N'Ghana'),
	(N'GI', N'Gibraltar'),
	(N'GL', N'Greenland'),
	(N'GM', N'Gambia'),
	(N'GN', N'Guinea'),
	(N'GP', N'Guadeloupe'),
	(N'GQ', N'Equatorial Guinea'),
	(N'GR', N'Greece'),
	(N'GS', N'South Georgia and the South Sandwich Islands'),
	(N'GT', N'Guatemala'),
	(N'GU', N'Guam'),
	(N'GW', N'Guinea-Bissau'),
	(N'GY', N'Guyana'),
	(N'HK', N'Hong Kong'),
	(N'HM', N'Heard Island and McDonald Islands'),
	(N'HN', N'Honduras'),
	(N'HR', N'Croatia'),
	(N'HT', N'Haiti'),
	(N'HU', N'Hungary'),
	(N'ID', N'Indonesia'),
	(N'IE', N'Ireland'),
	(N'IL', N'Israel'),
	(N'IM', N'Isle of Man'),
	(N'IN', N'India'),
	(N'IO', N'British Indian Ocean Territory'),
	(N'IQ', N'Iraq'),
	(N'IR', N'Iran, Islamic Republic of'),
	(N'IS', N'Iceland'),
	(N'IT', N'Italy'),
	(N'JE', N'Jersey'),
	(N'JM', N'Jamaica'),
	(N'JO', N'Jordan'),
	(N'JP', N'Japan'),
	(N'KE', N'Kenya'),
	(N'KG', N'Kyrgyzstan'),
	(N'KH', N'Cambodia'),
	(N'KI', N'Kiribati'),
	(N'KM', N'Comoros'),
	(N'KN', N'Saint Kitts and Nevis'),
	(N'KP', N'Korea, Democratic People''s Republic of'),
	(N'KR', N'Korea, Republic of'),
	(N'KW', N'Kuwait'),
	(N'KY', N'Cayman Islands'),
	(N'KZ', N'Kazakhstan'),
	(N'LA', N'Lao People''s Democratic Republic'),
	(N'LB', N'Lebanon'),
	(N'LC', N'Saint Lucia'),
	(N'LI', N'Liechtenstein'),
	(N'LK', N'Sri Lanka'),
	(N'LR', N'Liberia'),
	(N'LS', N'Lesotho'),
	(N'LT', N'Lithuania'),
	(N'LU', N'Luxembourg'),
	(N'LV', N'Latvia'),
	(N'LY', N'Libya'),
	(N'MA', N'Morocco'),
	(N'MC', N'Monaco'),
	(N'MD', N'Moldova, Republic of'),
	(N'ME', N'Montenegro'),
	(N'MF', N'Saint Martin (French part)'),
	(N'MG', N'Madagascar'),
	(N'MH', N'Marshall Islands'),
	(N'MK', N'Macedonia, the former Yugoslav Republic of'),
	(N'ML', N'Mali'),
	(N'MM', N'Myanmar'),
	(N'MN', N'Mongolia'),
	(N'MO', N'Macao'),
	(N'MP', N'Northern Mariana Islands'),
	(N'MQ', N'Martinique'),
	(N'MR', N'Mauritania'),
	(N'MS', N'Montserrat'),
	(N'MT', N'Malta'),
	(N'MU', N'Mauritius'),
	(N'MV', N'Maldives'),
	(N'MW', N'Malawi'),
	(N'MX', N'Mexico'),
	(N'MY', N'Malaysia'),
	(N'MZ', N'Mozambique'),
	(N'NA', N'Namibia'),
	(N'NC', N'New Caledonia'),
	(N'NE', N'Niger'),
	(N'NF', N'Norfolk Island'),
	(N'NG', N'Nigeria'),
	(N'NI', N'Nicaragua'),
	(N'NL', N'Netherlands'),
	(N'NO', N'Norway'),
	(N'NP', N'Nepal'),
	(N'NR', N'Nauru'),
	(N'NU', N'Niue'),
	(N'NZ', N'New Zealand'),
	(N'OM', N'Oman'),
	(N'PA', N'Panama'),
	(N'PE', N'Peru'),
	(N'PF', N'French Polynesia'),
	(N'PG', N'Papua New Guinea'),
	(N'PH', N'Philippines'),
	(N'PK', N'Pakistan'),
	(N'PL', N'Poland'),
	(N'PM', N'Saint Pierre and Miquelon'),
	(N'PN', N'Pitcairn'),
	(N'PR', N'Puerto Rico'),
	(N'PS', N'Palestine, State of'),
	(N'PT', N'Portugal'),
	(N'PW', N'Palau'),
	(N'PY', N'Paraguay'),
	(N'QA', N'Qatar'),
	(N'RE', N'R�union'),
	(N'RO', N'Romania'),
	(N'RS', N'Serbia'),
	(N'RU', N'Russian Federation'),
	(N'RW', N'Rwanda'),
	(N'SA', N'Saudi Arabia'),
	(N'SB', N'Solomon Islands'),
	(N'SC', N'Seychelles'),
	(N'SD', N'Sudan'),
	(N'SE', N'Sweden'),
	(N'SG', N'Singapore'),
	(N'SH', N'Saint Helena, Ascension and Tristan da Cunha'),
	(N'SI', N'Slovenia'),
	(N'SJ', N'Svalbard and Jan Mayen'),
	(N'SK', N'Slovakia'),
	(N'SL', N'Sierra Leone'),
	(N'SM', N'San Marino'),
	(N'SN', N'Senegal'),
	(N'SO', N'Somalia'),
	(N'SR', N'Suriname'),
	(N'SS', N'South Sudan'),
	(N'ST', N'Sao Tome and Principe'),
	(N'SV', N'El Salvador'),
	(N'SX', N'Sint Maarten (Dutch part)'),
	(N'SY', N'Syrian Arab Republic'),
	(N'SZ', N'Swaziland'),
	(N'TC', N'Turks and Caicos Islands'),
	(N'TD', N'Chad'),
	(N'TF', N'French Southern Territories'),
	(N'TG', N'Togo'),
	(N'TH', N'Thailand'),
	(N'TJ', N'Tajikistan'),
	(N'TK', N'Tokelau'),
	(N'TL', N'Timor-Leste'),
	(N'TM', N'Turkmenistan'),
	(N'TN', N'Tunisia'),
	(N'TO', N'Tonga'),
	(N'TR', N'Turkey'),
	(N'TT', N'Trinidad and Tobago'),
	(N'TV', N'Tuvalu'),
	(N'TW', N'Taiwan, Province of China'),
	(N'TZ', N'Tanzania, United Republic of'),
	(N'UA', N'Ukraine'),
	(N'UG', N'Uganda'),
	(N'UM', N'United States Minor Outlying Islands'),
	(N'US', N'United States of America'),
	(N'UY', N'Uruguay'),
	(N'UZ', N'Uzbekistan'),
	(N'VA', N'Holy See'),
	(N'VC', N'Saint Vincent and the Grenadines'),
	(N'VE', N'Venezuela, Bolivarian Republic of'),
	(N'VG', N'Virgin Islands, British'),
	(N'VI', N'Virgin Islands, U.S.'),
	(N'VN', N'Viet Nam'),
	(N'VU', N'Vanuatu'),
	(N'WF', N'Wallis and Futuna'),
	(N'WS', N'Samoa'),
	(N'YE', N'Yemen'),
	(N'YT', N'Mayotte'),
	(N'ZA', N'South Africa'),
	(N'ZM', N'Zambia'),
	(N'ZW', N'Zimbabwe')
GO

CREATE TABLE [gender] (
	[id] NCHAR(1) NOT NULL,
	[name] NVARCHAR(255) NOT NULL,
	CONSTRAINT [pk_gender] PRIMARY KEY NONCLUSTERED ([id]),
	CONSTRAINT [uq_gender_name] UNIQUE CLUSTERED ([name])
)
GO

INSERT INTO [gender] ([id], [name])
VALUES
	(N'M', N'Male'),
	(N'F', N'Female')
GO

CREATE TABLE [genre] (
	[id] INT NOT NULL IDENTITY (1, 1),
	[uri] NVARCHAR(10) NOT NULL,
	[name] NVARCHAR(255) NOT NULL,
	CONSTRAINT [pk_genre] PRIMARY KEY CLUSTERED ([id]),
	CONSTRAINT [uq_genre_uri] UNIQUE ([uri]),
	CONSTRAINT [uq_genre_name] UNIQUE ([name]),
	CONSTRAINT [ck_genre_uri] CHECK ([uri] NOT LIKE N'%[^A-Z0-9]%' AND [uri] = LOWER([uri]) COLLATE Latin1_General_CS_AS)
)
GO

SET IDENTITY_INSERT [genre] ON
INSERT INTO [genre] ([id], [uri], [name])
VALUES
	(1, N'salsa', N'Salsa'),
	(2, N'bachata', N'Bachata'),
	(3, N'kizomba', N'Kizomba'),
	(4, N'chachacha', N'Cha Cha Ch�'),
	(5, N'brazouk', N'Brazilian Zouk')
SET IDENTITY_INSERT [genre] OFF
GO

CREATE TABLE [style] (
	[genreId] INT NOT NULL,
	[id] INT NOT NULL IDENTITY (1, 1),
	[uri] NVARCHAR(10) NOT NULL,
	[name] NVARCHAR(255) NOT NULL,
	[sort] INT NOT NULL,
	CONSTRAINT [pk_style] PRIMARY KEY NONCLUSTERED ([genreId], [id]),
	CONSTRAINT [uq_style_id] UNIQUE ([id]),
	CONSTRAINT [uq_style_uri] UNIQUE ([uri]),
	CONSTRAINT [uq_style_name] UNIQUE ([name]),
	CONSTRAINT [uq_style_sort] UNIQUE CLUSTERED ([genreId], [sort]),
	CONSTRAINT [ck_style_uri] CHECK ([uri] NOT LIKE N'%[^A-Z0-9]%' AND [uri] = LOWER([uri]) COLLATE Latin1_General_CS_AS)
)
GO

SET IDENTITY_INSERT [style] ON
INSERT INTO [style] ([genreId], [id], [uri], [name], [sort])
VALUES
	(1, 1, N'on1', N'Cross-Body On1', 1),
	(1, 2, N'on2', N'Cross-Body On2', 2),
	(1, 3, N'casino', N'Cuban Casino', 3),
	(1, 4, N'rueda', N'La Rueda de Casino', 4),
	(1, 5, N'son', N'Son/Contratiempo', 5),
	(1, 6, N'calena', N'Colombian/Cali', 6),
	(2, 7, N'dominican', N'Dominican Bachata', 1),
	(2, 8, N'moderna', N'Bachata Moderna', 2),
	(2, 9, N'sensual', N'Sensual Bachata', 3),
	(2, 10, N'bachatango', N'BachaTango', 4),
	(3, 11, N'kizomba', N'Kizomba', 1),
	(3, 12, N'urbankiz', N'Urban Kiz', 2),
	(3, 13, N'semba', N'Semba', 3),
	(4, 14, N'chachacha', N'Cha Cha Ch�', 1),
	(5, 15, N'riozouk', N'Rio Zouk', 1),
	(5, 16, N'lambazouk', N'Lambazouk', 2),
	(5, 17, N'mzouk', N'Modern Zouk', 3)
SET IDENTITY_INSERT [style] ON
GO

CREATE TABLE [user] (
	[id] NVARCHAR(25) NOT NULL,
	[forename] NVARCHAR(127) NOT NULL,
	[surname] NVARCHAR(127) NOT NULL,
	[name] AS [forename] + N' ' + [surname] PERSISTED,
	[genderId] NCHAR(1) NULL,
	[countryId] NCHAR(2) NULL,
	[ping] DATETIMEOFFSET NOT NULL,
	[genreId] INT NULL,
	[styleId] INT NULL,
	CONSTRAINT [pk_user] PRIMARY KEY CLUSTERED ([id]),
	CONSTRAINT [fk_user_gender] FOREIGN KEY ([genderId]) REFERENCES [gender] ([id]),
	CONSTRAINT [fk_user_country] FOREIGN KEY ([countryId]) REFERENCES [country] ([id]),
	CONSTRAINT [fk_user_genre] FOREIGN KEY ([genreId]) REFERENCES [genre] ([id]),
	CONSTRAINT [fk_user_style] FOREIGN KEY ([styleId]) REFERENCES [style] ([id]),
)
GO

CREATE TABLE [video] (
	[id] NVARCHAR(25) NOT NULL,
	[title] NVARCHAR(255) NOT NULL,
	[thumbnail] NVARCHAR(max) NULL,
	[dateRecommended] DATETIMEOFFSET NOT NULL,
	[userId] NVARCHAR(25) NOT NULL,
	CONSTRAINT [pk_video] PRIMARY KEY CLUSTERED ([id]),
	CONSTRAINT [fk_video_user] FOREIGN KEY ([userId]) REFERENCES [user] ([id])
)
GO

CREATE TABLE [review] (
	[videoId] NVARCHAR(25) NOT NULL,
	[genreId] INT NOT NULL,
	[styleId] INT NOT NULL,
	[userId] NVARCHAR(25) NOT NULL,
	[like] BIT NOT NULL,
	[dislike] AS ~[like] PERSISTED,
	[dateReviewed] DATETIMEOFFSET NOT NULL,
	CONSTRAINT [pk_review] PRIMARY KEY CLUSTERED ([videoId], [genreId], [styleId], [userId]),
	CONSTRAINT [fk_review_video] FOREIGN KEY ([videoId]) REFERENCES [video] ([id]),
	CONSTRAINT [fk_review_style] FOREIGN KEY ([genreId], [styleId]) REFERENCES [style] ([genreId], [id]),
	CONSTRAINT [fk_review_user] FOREIGN KEY ([userId]) REFERENCES [user] ([id])
)
GO

CREATE TABLE [favourite] (
	[userId] NVARCHAR(25) NOT NULL,
	[genreId] INT NOT NULL,
	[videoId] NVARCHAR(25) NOT NULL,
	CONSTRAINT [pk_favourite] PRIMARY KEY CLUSTERED ([userId], [genreId], [videoId]),
	CONSTRAINT [fk_favourite_user] FOREIGN KEY ([userId]) REFERENCES [user] ([id]),
	CONSTRAINT [fk_favourite_genre] FOREIGN KEY ([genreId]) REFERENCES [genre] ([id]),
	CONSTRAINT [fk_favourite_video] FOREIGN KEY ([videoId]) REFERENCES [video] ([id])
)
GO

CREATE PROCEDURE [apiLogin](
	@userId NVARCHAR(25),
	@forename NVARCHAR(127),
	@surname NVARCHAR(127),
	@gender NVARCHAR(6) = NULL,
	@countryId NCHAR(2) = NULL
)
AS
BEGIN
	MERGE [User] t
	USING (
			SELECT
				[userId] = @userId,
				[forename] = @forename,
				[surname] = @surname,
				[genderId] = (SELECT [Id] FROM [gender] WHERE [Name] = @gender),
				[countryId] = (SELECT [Id] FROM [country] WHERE [Id] = @countryId),
				[ping] = GETUTCDATE()
		) s
	ON t.[Id] = s.[userId]
	WHEN MATCHED THEN
		UPDATE
		SET
			[forename] = s.[forename],
			[surname] = s.[surname],
			[genderId] = s.[genderId],
			[countryId] = s.[countryId],
			[ping] = s.[ping]
	WHEN NOT MATCHED BY TARGET THEN
		INSERT ([Id], [forename], [surname], [genderId], [countryId], [ping])
		VALUES (s.[userId], s.[forename], s.[surname], s.[genderId], s.[countryId], s.[ping]);
	SELECT
		[id],
		[name]
	FROM [user]
	WHERE [id] = @userId
	FOR XML PATH (N'data')
END
GO

CREATE PROCEDURE [apiImport](@import XML, @commit BIT = 0, @userId NVARCHAR(25) = NULL)
AS
BEGIN
	SET NOCOUNT ON
	BEGIN TRANSACTION
	BEGIN TRY
		-- Import Users
		;WITH [import] AS (
				SELECT
					[id] = n.value(N'id[1]', N'NVARCHAR(25)'),
					[forename] = n.value(N'forename[1]', N'NVARCHAR(127)'),
					[surname] = n.value(N'surname[1]', N'NVARCHAR(127)'),
					[genderId] = n.value(N'genderId[1]', N'NCHAR(1)'),
					[countryId] = n.value(N'countryId[1]', N'NCHAR(2)'),
					[ping] = n.value(N'ping[1]', N'DATETIMEOFFSET'),
					[genreId] = n.value(N'genreId[1]', N'INT'),
					[styleId] = n.value(N'styleId[1]', N'INT')
				FROM @import.nodes(N'/gm[1]/users[1]/user') x (n)
			)
		INSERT INTO [user] (
				[id],
				[forename],
				[surname],
				[genderId],
				[countryId],
				[ping],
				[genreId],
				[styleId]
			)
		SELECT
			i.[id],
			i.[forename],
			i.[surname],
			i.[genderId],
			i.[countryId],
			i.[ping],
			i.[genreId],
			i.[styleId]
		FROM [import] i
			LEFT JOIN [user] u ON i.[id] = u.[id]
		WHERE u.[id] IS NULL
		PRINT N'imported ' + CONVERT(NVARCHAR(10), @@ROWCOUNT) + N' user(s)'
		-- Import Videos
		;WITH [import] AS (
				SELECT
					[id] = n.value(N'id[1]', N'NVARCHAR(25)'),
					[title] = n.value(N'title[1]', N'NVARCHAR(255)'),
					[thumbnail] = n.value(N'thumbnail[1]', N'NVARCHAR(max)'),
					[dateRecommended] = n.value(N'dateRecommended[1]', N'DATETIMEOFFSET'),
					[userId] = n.value(N'userId[1]', N'NVARCHAR(25)')
				FROM @import.nodes(N'/gm[1]/videos[1]/video') x (n)
			)
		INSERT INTO [video] (
				[id],
				[title],
				[thumbnail],
				[dateRecommended],
				[userId]
			)
		SELECT
			i.[id],
			i.[title],
			i.[thumbnail],
			i.[dateRecommended],
			i.[userId]
		FROM [import] i
			LEFT JOIN [video] v ON i.[id] = v.[id]
		WHERE v.[id] IS NULL
		PRINT N'imported ' + CONVERT(NVARCHAR(10), @@ROWCOUNT) + N' video(s)'
		-- Import Reviews
		;WITH [import] AS (
				SELECT
					[videoId] = n.value(N'videoId[1]', N'NVARCHAR(25)'),
					[genreId] = n.value(N'genreId[1]', N'INT'),
					[styleId] = n.value(N'styleId[1]', N'INT'),
					[userId] = n.value(N'userId[1]', N'NVARCHAR(25)'),
					[like] = n.value(N'like[1]', N'BIT'),
					[dateReviewed] = n.value(N'dateReviewed[1]', N'DATETIMEOFFSET')
				FROM @import.nodes(N'/gm[1]/reviews[1]/review') x (n)
			)
		INSERT INTO [review] (
				[videoId],
				[genreId],
				[styleId],
				[userId],
				[like],
				[dateReviewed]
			)
		SELECT
			i.[videoId],
			i.[genreId],
			i.[styleId],
			i.[userId],
			i.[like],
			i.[dateReviewed]
		FROM [import] i
			LEFT JOIN [review] r ON i.[videoId] = r.[videoId]
				AND i.[genreId] = r.[genreId]
				AND i.[styleId] = r.[styleId]
				AND i.[userId] = i.[userId]
		WHERE r.[like] IS NULL
		PRINT N'imported ' + CONVERT(NVARCHAR(10), @@ROWCOUNT) + N' review(s)'
		-- Commit/Rollback
		IF ISNULL(@commit, 0) = 1 BEGIN
			COMMIT TRANSACTION
			PRINT 'Commit'
		END ELSE BEGIN
			ROLLBACK TRANSACTION
			PRINT 'Rollback'
		END
	END TRY
	BEGIN CATCH
		DECLARE @message NVARCHAR(2048), @severity INT, @state INT
		SELECT @message = ERROR_MESSAGE(), @severity = ERROR_SEVERITY(), @state = ERROR_STATE()
		ROLLBACK TRANSACTION
		RAISERROR(@message, @severity, @state)
	END CATCH
	RETURN
END
GO

CREATE PROCEDURE [apiExport](@UserId NVARCHAR(25) = NULL)
AS
BEGIN
	SET NOCOUNT ON
	SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
	SELECT
		( -- Users
				SELECT
					[id],
					[forename],
					[surname],
					[genderId],
					[countryId],
					[ping],
					[genreId],
					[styleId]
				FROM [user]
				FOR XML PATH (N'user'), ROOT (N'users'), TYPE
			),
		( -- Videos
				SELECT
					[id],
					[title],
					[thumbnail],
					[dateRecommended],
					[userId]
				FROM [video]
				FOR XML PATH (N'video'), ROOT (N'videos'), TYPE
			),
		( -- Reviews
				SELECT
					[videoId],
					[genreId],
					[styleId],
					[userId],
					[like],
					[dateReviewed]
				FROM [review]
				FOR XML PATH (N'review'), ROOT (N'reviews'), TYPE
			)
	FOR XML PATH (N'gm')
	RETURN
END
GO

CREATE PROCEDURE [apiSearch](@userId NVARCHAR(25) = NULL)
AS
BEGIN
	SET NOCOUNT ON
	;WITH XMLNAMESPACES (N'http://james.newtonking.com/projects/json' AS [json])
	SELECT
		[@json:Array] = N'true',
		[id] = g.[id],
		[uri] = g.[uri],
		[name] = g.[name],
		[count] = ISNULL(gv.[count], 0),
		( -- Styles
				SELECT
					[@json:Array] = N'true',
					[id] = s.[id],
					[uri] = s.[uri],
					[name] = s.[name],
					[count] = ISNULL(sv.[count], 0)
				FROM [style] s
					LEFT JOIN (
							SELECT
								[genreId],
								[styleId],
								[count] = COUNT(DISTINCT [videoId])
							FROM [review]
							GROUP BY [genreId], [styleId]
						) sv ON s.[genreId] = sv.[genreId] AND s.[id] = sv.[styleId]
				WHERE s.[genreId] = g.[id]
				ORDER BY s.[sort]
				FOR XML PATH (N'styles'), TYPE
			)
	FROM [genre] g
		LEFT JOIN (
				SELECT
					[genreId],
					[count] = COUNT(DISTINCT [videoId])
				FROM [review]
				GROUP BY [genreId]
			) gv ON g.[id] = gv.[genreId]
	ORDER BY g.[name]
	FOR XML PATH (N'genres'), ROOT (N'data')
	RETURN
END
GO

CREATE PROCEDURE [apiPlaylistParameters](
	@period NVARCHAR(10) = NULL OUTPUT,
	@genreUri NVARCHAR(10) = NULL OUTPUT,
	@styleUri NVARCHAR(10) = NULL OUTPUT,
	@title NVARCHAR(255) = NULL OUTPUT
)
AS
BEGIN
	SET NOCOUNT ON
	SET @period = ISNULL((
			SELECT [period]
			FROM (VALUES
					(N'weekly'),
					(N'monthly'),
					(N'yearly')
				) p ([period])
			WHERE [period] = @period),
		N'all')
	SELECT
		@genreUri = g.[uri],
		@styleUri = s.[uri],
		@title = ISNULL(s.[name], g.[name])
	FROM [genre] g
		LEFT JOIN [style] s ON g.[id] = s.[genreId] AND s.[uri] = @styleUri
	WHERE g.[uri] = @genreUri
	RETURN
END
GO

CREATE PROCEDURE [apiPlaylist](
	@period NVARCHAR(10),
	@genreUri NVARCHAR(10),
	@styleUri NVARCHAR(10) = NULL,
	@userId NVARCHAR(25) = NULL
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @title NVARCHAR(255)
	EXEC [apiPlaylistParameters] @period OUT, @genreUri OUT, @styleUri OUT, @title OUT
	DECLARE @since DATETIMEOFFSET = CASE @period
		WHEN N'weekly' THEN DATEADD(week, -1, GETUTCDATE())
		WHEN N'monthly' THEN DATEADD(month, -1, GETUTCDATE())
		WHEN N'yearly' THEN DATEADD(year, -1, GETUTCDATE())
	END
	;WITH [reviews] AS (
			SELECT
				[videoId] = r.[videoId],
				[genreId] = r.[genreId],
				[dateLikes] = ISNULL(COUNT(NULLIF(a.[dateMatch] & r.[like], 0)), 0),
				[dateTotal] = NULLIF(COUNT(NULLIF(a.[dateMatch], 0)), 0),
				[like] = CONVERT(BIT, MAX(CONVERT(INT, a.[userMatch] & r.[like]))),
				[likes] = ISNULL(COUNT(NULLIF(r.[like], 0)), 0),
				[dislike] = CONVERT(BIT, MAX(CONVERT(INT, a.[userMatch] & r.[dislike]))),
				[dislikes] = ISNULL(COUNT(NULLIF(r.[dislike], 0)), 0),
				[total] = COUNT(*),
				[latest] = MAX(r.[dateReviewed])
			FROM [review] r
				JOIN [genre] g ON r.[genreId] = g.[id]
				JOIN [style] s ON r.[genreId] = s.[genreId] AND r.[styleId] = s.[id]
				CROSS APPLY (VALUES (
						CONVERT(BIT, CASE WHEN r.[dateReviewed] >= @since OR @since IS NULL THEN 1 ELSE 0 END),
						CONVERT(BIT, CASE WHEN r.[userId] = @userId THEN 1 ELSE 0 END)
					)) a ([dateMatch], [userMatch])
			WHERE g.[uri] = @genreUri
				AND (s.[uri] = @styleUri OR @styleUri IS NULL)
			GROUP BY r.[videoId], r.[genreId]
		)
	SELECT
		[title] = @title,
		( -- parameters
				SELECT
					[period] = @period,
					[genreUri] = @genreUri,
					[styleUri] = @styleUri
				FOR XML PATH (N'parameters'), TYPE
			),
		( -- videos
				SELECT
					[rank] = ROW_NUMBER() OVER (ORDER BY
							ISNULL(CONVERT(FLOAT, rvw.[dateLikes]) / CONVERT(FLOAT, rvw.[dateTotal]), CONVERT(FLOAT, 0)) DESC,
							ISNULL(CONVERT(FLOAT, rvw.[likes]) / CONVERT(FLOAT, rvw.[total]), CONVERT(FLOAT, 0)) DESC,
							rvw.[latest] DESC,
							v.[dateRecommended] DESC
						),
					[videoId] = rvw.[videoId],
					[title] = v.[title],
					[like] = rvw.[like],
					[likes] = rvw.[likes],
					[dislike] = rvw.[dislike],
					[dislikes] = rvw.[dislikes],
					[favourite] = CONVERT(BIT, CASE WHEN fav.[videoId] IS NOT NULL THEN 1 ELSE 0 END)
				FROM [reviews] rvw
					JOIN [video] v ON rvw.[videoId] = v.[id]
					LEFT JOIN [favourite] fav ON fav.[userId] = @userId
						AND rvw.[genreId] = fav.[genreId]
						AND rvw.[videoId] = fav.[videoId]
				ORDER BY 1
				FOR XML PATH (N'videos'), TYPE
			)
	FOR XML PATH (N'data')
	RETURN
END
GO
