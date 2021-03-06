var path = require('path');

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Case Model
 * ==========
 */
var Case = new keystone.List('Case', {
	map: { name: 'slug' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	defaultSort: '-updatedAt',
});

var imageDirectory = 'images';
var imageStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: path.join(process.env.PATH_STATIC, imageDirectory),
		publicPath: path.join(process.env.PATH_PUBLIC, imageDirectory),
	},
});

Case.add({
	title: {
		en: { type: String, required: true, initial: true },
		ru: { type: String },
		ua: { type: String },
	},
	slug: { type: String, readonly: true },
	image: { type: Types.File, storage: imageStorage },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
	createdAt: { type: Date, hidden: true },
	updatedAt: { type: Date, hidden: true },
});

Case.schema.pre('save', function (next) {
	var currentDate = new Date();

	this.updatedAt = currentDate;

	if (!this.createdAt) {
		this.createdAt = currentDate;
	}

	next();
});

Case.relationship({ path: 'caseBlocks', ref: 'CaseBlock', refPath: 'case' });

Case.defaultColumns = 'title.en, slug|20%, updatedAt, createdAt';
Case.register();

module.exports = Case;
