const path = require('path');

/**
 * @typedef {JsonKdbxData}
 * @property { { kdbxFile: string } & JsonKdbxHeader} header
 * @property {JsonKdbxGroup[]} groups
 */
/**
 * This helper function converts a kdbx object to a simple json object.
 *
 * TODO: these functions could be moved to the external kdbxweb library!?
 *
 * @param {string} kdbxFile - path to the kdbx file
 * @param {kdbxweb.Kdbx} kdbx - a complex kdbxweb.Kdbx object
 * @returns {JsonKdbxData} - object containing useful kdbx data
 */
function kdbxToJson(kdbxFile, kdbx) {
	const kdbxFileAbsolute = path.resolve(kdbxFile);
	return {
		header: {
			kdbxFile: path.basename(kdbxFileAbsolute),
			..._kdbxHeaderToJson(kdbx.header),
		},
		groups: kdbx.groups.map(_kdbxGroupToJson),
		//entries: kdbx.getDefaultGroup().entries.map(kdbxEntryToJson),
	};
}

/**
 * @typedef {Object} JsonKdbxHeader
 * @property {string} version
 */
/**
 * @param {kdbxweb.KdbxHeader} header
 */
function _kdbxHeaderToJson(header) {
	return {
		version: `${header?.versionMajor}.${header?.versionMinor}`,
		//dataCipherUuid: KdbxUuid | undefined;
		//compression: header?.compression,
		//masterSeed: ArrayBuffer | undefined;
		//transformSeed: ArrayBuffer | undefined;
		//keyEncryptionRounds: header?.keyEncryptionRounds,
		//encryptionIV: ArrayBuffer | undefined;
		//protectedStreamKey: ArrayBuffer | undefined;
		//streamStartBytes: ArrayBuffer | undefined;
		//crsAlgorithm: header?.crsAlgorithm,
		//endPos: header?.endPos,
		//kdfParameters: VarDictionary | undefined;
		//publicCustomData: VarDictionary | undefined;
	};
}

function _kdbxEntryFieldToJson(value) {
	if (typeof value === 'object' && value.getText) {
		return value.getText();
	} else {
		return value;
	}
}

/**
 * @param {Map<string, kdbxweb.KdbxEntryField>} fieldsMap
 */
function _kdbxFieldsMapToJson(fieldsMap) {
	const fields = {};
	for (const [key, value] of fieldsMap) {
		fields[key] = _kdbxEntryFieldToJson(value);
	}
	return fields;
}

/**
 * @typedef {Object} JsonKdbxTimes
 * @property {number} [creationTime]
 * @property {number} [lastModTime]
 * @property {number} [lastAccessTime]
 * @property {boolean} [expires]
 * @property {number} [expiryTime] - only if expires is true
 */
/**
 * @param {kdbxweb.KdbxTimes} times
 */
function _kdbxTimesToJson(times) {
	const timesJson = {
		creationTime: times?.creationTime,
		lastModTime: times?.lastModTime,
		lastAccessTime: times?.lastAccessTime,
	};
	if (times?.expires) {
		timesJson.expires = times?.expires;
		timesJson.expiryTime = times?.expiryTime;
	}
	return timesJson;
}

/**
 * @param {kdbxweb.KdbxUuid} uuid
 */
function _kdbxUuidToJson(uuid) {
	return uuid?.toString();
}

/**
 * @typedef {Object} JsonKdbxGroup
 * @property {string} name
 * @property {string} notes
 * @property {string[]} tags
 * @property {JsonKdbxTimes} times
 *
 *
 */
/**
 * @param {kdbxweb.KdbxGroup} group
 */
function _kdbxGroupToJson(group) {
	return {
		//uuid: _kdbxUuidToJson(group?.uuid),
		name: group?.name,
		notes: group?.notes,
		//icon: group?.icon,
		//customIcon: _kdbxUuidToJson(group?.customIcon),
		tags: group?.tags,
		times: _kdbxTimesToJson(group?.times),
		//expanded: group?.expanded,
		//defaultAutoTypeSeq: group?.defaultAutoTypeSeq,
		//enableAutoType: group?.enableAutoType,
		//enableSearching: group?.enableSearching,
		//lastTopVisibleEntry: _kdbxUuidToJson(group?.lastTopVisibleEntry),
		groups: group?.groups?.map(_kdbxGroupToJson) || [],
		entries: group?.entries?.map(_kdbxEntryToJson) || [],
		//parentGroup: _kdbxUuidToJson(group?.parentGroup),
		//previousParentGroup: _kdbxUuidToJson(group?.previousParentGroup),
		//customData: KdbxCustomDataMap | undefined;
	};
}

/**
 * @typedef {Object} JsonKdbxEntry
 * @property {string[]} tags
 * @property {JsonKdbxTimes} times
 * @property {object} fields
 */
/**
 * @param {kdbxweb.KdbxEntry} entry
 */
function _kdbxEntryToJson(entry) {
	return {
		//uuid: _kdbxUuidToJson(entry?.uuid),
		//icon: entry?.icon,
		//customIcon: _kdbxUuidToJson(entry?.customIcon),
		//fgColor: entry?.fgColor,
		//bgColor: entry?.bgColor,
		//overrideUrl: entry?.overrideUrl,
		tags: entry?.tags,
		times: _kdbxTimesToJson(entry?.times),
		fields: _kdbxFieldsMapToJson(entry?.fields),
		//binaries: KdbxBinariesMap | undefined;
		//autoType: entry.autoType,
		//history: entry?.history?.map(KdbxEntryToJson) || [],
		//parentGroup: KdbxGroupToJson(entry?.parentGroup),
		//previousParentGroup: _kdbxUuidToJson(entry?.previousParentGroup),
		//customData: KdbxCustomDataMap | undefined;
		//qualityCheck: entry?.qualityCheck,
	};
}

module.exports = {
	kdbxToJson,
};
