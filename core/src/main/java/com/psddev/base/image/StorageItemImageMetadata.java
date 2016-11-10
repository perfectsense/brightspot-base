package com.psddev.base.image;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.LocalTime;
import org.joda.time.format.DateTimeFormat;

import com.psddev.dari.db.Location;
import com.psddev.dari.util.CollectionUtils;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StorageItem;

/**
 * Parses out the IPTC/EXIF/GPS information from a an image StorageItem's
 * metadata and exposes it in convenient to use APIs.
 *
 * NOTE: These mappings depend on version 2.8.1 of the drewnoakes image
 * extraction library.
 */
public class StorageItemImageMetadata {

    private interface MetadataField {

        String getDirectoryName();

        String getFieldName();

        default String getMetadataFieldKey() {
            return getDirectoryName() + "/" + getFieldName().replace("/", "//");
        }
    }

    private enum ExifThumbnailDirectory implements MetadataField {

        RESOLUTION_UNIT("Resolution Unit"),
        LENGTH("Thumbnail Length"),
        OFFSET("Thumbnail Offset"),
        COMPRESSION("Thumbnail Compression"),
        X_RESOLUTION("X Resolution"),
        Y_RESOLUTION("Y Resolution");

        private String fieldName;

        ExifThumbnailDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Exif Thumbnail";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum JpegDirectory implements MetadataField {

        NUMBER_OF_COMPONENTS("Number of Components"),
        COMPONENT_1("Component 1"),
        COMPONENT_2("Component 2"),
        COMPONENT_3("Component 3"),
        COMPRESSION_TYPE("Compression Type"),
        DATA_PRECISION("Data Precision"),
        IMAGE_HEIGHT("Image Height"),
        IMAGE_WIDTH("Image Width");

        private String fieldName;

        JpegDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "JPEG";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum GpsDirectory implements MetadataField {

        GPS_VERSION_ID("GPS Version ID"),
        GPS_LATITUDE("GPS Latitude"),
        GPS_LATITUDE_REF("GPS Latitude Ref"),
        GPS_LONGITUDE("GPS Longitude"),
        GPS_LONGITUDE_REF("GPS Longitude Ref"),
        GPS_TIME_STAMP("GPS Time-Stamp");

        private String fieldName;

        GpsDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "GPS";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum InteroperabilityDirectory implements MetadataField {

        VERSION("Interoperability Version"),
        INDEX("Interoperability Index");

        private String fieldName;

        InteroperabilityDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Interoperability";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum IptcDirectory implements MetadataField {

        BY_LINE_TITLE("By-line Title"),
        CATEGORY("Category"),
        BY_LINE("By-line"),
        CAPTION_ABSTRACT("Caption/Abstract"),
        CITY("City"),
        HEADLINE("Headline"),
        KEYWORDS("Keywords"),
        OBJECT_NAME("Object Name"),
        SUPPLEMENTAL_CATEGORIES("Supplemental Category(s)"),
        ORIGINAL_TRANSMISSION_REFERENCE("Original Transmission Reference"),
        CAPTION_WRITER_EDITOR("Caption Writer/Editor"),
        CREDIT("Credit"),
        SOURCE("Source"),
        COPYRIGHT_NOTICE("Copyright Notice"),
        COUNTRY_PRIMARY_LOCATION_NAME("Country/Primary Location Name"),
        APPLICATION_RECORD_VERSION("Application Record Version"),
        URGENCY("Urgency"),
        TIME_CREATED("Time Created"),
        DATE_CREATED("Date Created");

        private String fieldName;

        IptcDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "IPTC";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum ExifSubIfdDirectory implements MetadataField {

        LENS_MODEL("Lens Model"),
        EXIF_VERSION("Exif Version"),
        COMPONENTS_CONFIGURATION("Components Configuration"),
        FLASH_PIX_VERSION("FlashPix Version"),
        FOCAL_PLANE_X_RESOLUTION("Focal Plane X Resolution"),
        SUB_SEC_TIME_ORIGINAL("Sub-Sec Time Original"),
        FOCAL_LENGTH("Focal Length"),
        SUBJECT_DISTANCE("Subject Distance"),
        SUB_SEC_TIME_DIGITIZED("Sub-Sec Time Digitized"),
        DATE_TIME_ORIGINAL("Date/Time Original"),
        SHUTTER_SPEED_VALUE("Shutter Speed Value"),
        FOCAL_PLANE_RESOLUTION_UNIT("Focal Plane Resolution Unit"),
        GAMMA("Gamma"),
        COLOR_SPACE("Color Space"),
        F_NUMBER("F-Number"),
        DATE_TIME_DIGITIZED("Date/Time Digitized"),
        SENSITIVITY_TYPE("Sensitivity Type"),
        EXPOSURE_PROGRAM("Exposure Program"),
        FLASH("Flash"),
        APERTURE_VALUE("Aperture Value"),
        USER_COMMENT("User Comment"),
        EXPOSURE_TIME("Exposure Time"),
        ISO_SPEED_RATINGS("ISO Speed Ratings"),
        RECOMMENDED_EXPOSURE_INDEX("Recommended Exposure Index"),
        EXIF_IMAGE_WIDTH("Exif Image Width"),
        METERING_MODE("Metering Mode"),
        BODY_SERIAL_NUMBER("Body Serial Number"),
        EXPOSURE_BIAS_VALUE("Exposure Bias Value"),
        FOCAL_PLANE_Y_RESOLUTION("Focal Plane Y Resolution"),
        CAMERA_OWNER_NAME("Camera Owner Name"),
        LENS_SPECIFICATION("Lens Specification"),
        LENS_SERIAL_NUMBER("Lens Serial Number"),
        MAX_APERTURE_VALUE("Max Aperture Value"),
        EXPOSURE_MODE("Exposure Mode"),
        SCENE_CAPTURE_TYPE("Scene Capture Type"),
        CUSTOM_RENDERED("Custom Rendered"),
        EXIF_IMAGE_HEIGHT("Exif Image Height"),
        SUB_SEC_TIME("Sub-Sec Time"),
        WHITE_BALANCE_MODE("White Balance Mode");

        private String fieldName;

        ExifSubIfdDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Exif SubIFD";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum IccProfileDirectory implements MetadataField {

        MEDIA_BLACK_POINT("Media Black Point"),
        GREEN_TRC("Green TRC"),
        CMM_TYPE("CMM Type"),
        XYZ_VALUES("XYZ values"),
        GREEN_COLORANT("Green Colorant"),
        PROFILE_DESCRIPTION("Profile Description"),
        BLUE_TRC("Blue TRC"),
        RED_COLORANT("Red Colorant"),
        TAG_COUNT("Tag Count"),
        PROFILE_SIZE("Profile Size"),
        BLUE_COLORANT("Blue Colorant"),
        COPYRIGHT("Copyright"),
        DEVICE_MANUFACTURER("Device manufacturer"),
        VERSION("Version"),
        COLOR_SPACE("Color space"),
        SIGNATURE("Signature"),
        CLASS("Class"),
        PROFILE_DATE_TIME("Profile Date/Time"),
        PROFILE_CONNECTION_SPACE("Profile Connection Space"),
        MEDIA_WHITE_POINT("Media White Point"),
        PRIMARY_PLATFORM("Primary Platform"),
        RED_TRC("Red TRC");

        private String fieldName;

        IccProfileDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "ICC Profile";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum ExifIfd0Directory implements MetadataField {

        ARTIST("Artist"),
        DATE_TIME("Date/Time"),
        MAKE("Make"),
        SAMPLES_PER_PIXEL("Samples Per Pixel"),
        YCBCR_POSITIONING("YCbCr Positioning"),
        IMAGE_HEIGHT("Image Height"),
        ORIENTATION("Orientation"),
        WHITE_POINT("White Point"),
        X_RESOLUTION("X Resolution"),
        IMAGE_WIDTH("Image Width"),
        PRIMARY_CHROMATICITIES("Primary Chromaticities"),
        YCBCR_COEFFICIENTS("YCbCr Coefficients"),
        PHOTOMETRIC_INTERPRETATION("Photometric Interpretation"),
        RESOLUTION_UNIT("Resolution Unit"),
        MODEL("Model"),
        SOFTWARE("Software"),
        BITS_PER_SAMPLE("Bits Per Sample"),
        Y_RESOLUTION("Y Resolution");

        private String fieldName;

        ExifIfd0Directory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Exif IFD0";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum XmpDirectory implements MetadataField {

        XMP_VALUE_COUNT("XMP Value Count"),
        RATING("Rating");

        private String fieldName;

        XmpDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Xmp";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum PhotoshopDirectory implements MetadataField {

        // Nothing here yet, but need placeholder...
        FOO("foo");

        private String fieldName;

        PhotoshopDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Photoshop";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    private enum AdobeJpegDirectory implements MetadataField {

        COLOR_TRANSFORM("Color Transform"),
        DCT_ENCODE_VERSION("DCT Encode Version"),
        FLAGS_0("Flags 0"),
        FLAGS_1("Flags 1");

        private String fieldName;

        AdobeJpegDirectory(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String getDirectoryName() {
            return "Adobe JPEG";
        }

        @Override
        public String getFieldName() {
            return fieldName;
        }
    }

    /* FILE NAME */
    private static final String ORIGINAL_FILENAME_KEY = "originalFilename";

    /* DIMENSIONS */
    private static final String WIDTH_KEY = "width"; // 1600
    private static final String HEIGHT_KEY = "height"; // 1200

    private static final String ORIGINAL_WIDTH_KEY = "originalWidth";
    private static final String ORIGINAL_HEIGHT_KEY = "originalHeight";

    /* HTTP HEADERS */
    private static final String HTTP_HEADER_CACHE_CONTROL_KEY = "http.headers/Cache-Control"; // [ "public, max-age=31536000" ]
    private static final String HTTP_HEADER_CONTENT_LENGTH_KEY = "http.headers/Content-Length"; // [ "99360" ]
    private static final String HTTP_HEADER_CONTENT_TYPE_KEY = "http.headers/Content-Type"; // [ "image/jpeg" ]

    /* EXIF_ORIENTATION_KEY values */
    private static final Map<String, Integer> EXIF_IMAGE_ORIENTATIONS; static {
        Map<String, Integer> map = new HashMap<>();
        map.put("Top, left side (Horizontal / normal)",                     1);
        map.put("Top, right side (Mirror horizontal)",                      2);
        map.put("Bottom, right side (Rotate 180)",                          3);
        map.put("Bottom, left side (Mirror vertical)",                      4);
        map.put("Left side, top (Mirror horizontal and rotate 270 CW)",     5);
        map.put("Right side, top (Rotate 90 CW)",                           6);
        map.put("Right side, bottom (Mirror horizontal and rotate 90 CW)",  7);
        map.put("Left side, bottom (Rotate 270 CW)",                        8);
        EXIF_IMAGE_ORIENTATIONS = map;
    }

    private static final transient MetadataField[] EXIF_DATE_TIME_KEYS = {
        ExifSubIfdDirectory.DATE_TIME_DIGITIZED,
        ExifSubIfdDirectory.DATE_TIME_ORIGINAL,
        ExifIfd0Directory.DATE_TIME
    };

    private static final transient MetadataField[] METADATA_TITLE_KEYS = {
        IptcDirectory.HEADLINE,
        IptcDirectory.OBJECT_NAME
    };

    private static final transient MetadataField[] METADATA_BYLINE_KEYS = {
        IptcDirectory.BY_LINE,
        ExifIfd0Directory.ARTIST
    };

    /* Date-Time Format: 2014:01:22 12:12:44 */
    private static final String EXIF_DATE_TIME_FORMAT = "yyyy:MM:dd hh:mm:ss";

    /* Time Format: 121244+0000 */
    private static final String IPTC_TIME_CREATED_FORMAT = "hhmmss+SSSS";

    /* Date Format: Wed Jan 22 00:00:00 EST 2014 */
    private static final String IPTC_DATE_CREATED_FORMAT = "EEE MMM dd 00:00:00 zzz yyyy";

    private Map<String, Object> metadata;

    /**
     * TODO: Javadocs
     *
     * @param item
     */
    public StorageItemImageMetadata(StorageItem item) {
        if (item != null) {
            metadata = item.getMetadata();
        }
        if (metadata == null) {
            metadata = new HashMap<>();
            if (item != null) {
                // FIXME: Need to rethink the mutability aspect of this...
                item.setMetadata(metadata);
            }
        }
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public Integer getWidth() {
        return getValueForKey(Integer.class, WIDTH_KEY);
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public Integer getHeight() {
        return getValueForKey(Integer.class, HEIGHT_KEY);
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public String getCaption() {
        return getValueForKey(String.class, IptcDirectory.CAPTION_ABSTRACT);
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public String getTitle() {
        return getFirstNonBlankValueForKeys(String.class, METADATA_TITLE_KEYS);
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public String getOriginalFileName() {
        return getValueForKey(String.class, ORIGINAL_FILENAME_KEY);
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public String getByline() {
        return getFirstNonBlankValueForKeys(String.class, METADATA_BYLINE_KEYS);
    }

    /**
     * TODO: Javadocs
     * @return
     */
    public String getCredit() {
        return getValueForKey(String.class, IptcDirectory.CREDIT);
    }

    /**
     * TODO: Javadocs
     * @return
     */
    public String getSource() {
        return getValueForKey(String.class, IptcDirectory.SOURCE);
    }

    /**
     * TODO: Javadocs
     * @return
     */
    public String getCopyrightNotice() {
        return getValueForKey(String.class, IptcDirectory.COPYRIGHT_NOTICE);
    }

    /**
     * TODO: Javadocs
     * @return
     */
    public List<String> getKeywords() {
        String keywords = getValueForKey(String.class, IptcDirectory.KEYWORDS);
        if (!StringUtils.isBlank(keywords)) {
            return Arrays.asList(keywords.split("\\|"));
        }
        return new ArrayList<>();
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public Date getDateTaken() {

        DateTime dateTaken = null;

        // check the IPTC metadata fields
        String iptcDate = getValueForKey(String.class, IptcDirectory.DATE_CREATED);
        if (iptcDate != null) {
            // check the date part
            try {
                dateTaken = DateTimeFormat.forPattern(IPTC_DATE_CREATED_FORMAT).parseDateTime(iptcDate);
            } catch (RuntimeException e) {
                // do nothing
            }
            if (dateTaken != null) {
                // check the time part
                String iptcTime = getValueForKey(String.class, IptcDirectory.TIME_CREATED);
                if (iptcTime != null) {
                    LocalTime timeTaken = null;
                    try {
                        timeTaken = LocalTime.parse(iptcTime, DateTimeFormat.forPattern(IPTC_TIME_CREATED_FORMAT));
                    } catch (RuntimeException e) {
                        // do nothing
                    }
                    // apply the time to the date
                    if (timeTaken != null) {
                        dateTaken = dateTaken.withFields(timeTaken);
                    }
                }
            }
        }

        // check the exif metadata fields
        if (dateTaken == null) {
            String exifDateTime = getFirstNonBlankValueForKeys(String.class, EXIF_DATE_TIME_KEYS);
            if (exifDateTime != null) {
                try {
                    dateTaken = DateTimeFormat.forPattern(EXIF_DATE_TIME_FORMAT).parseDateTime(exifDateTime);
                } catch (RuntimeException e) {
                    // do nothing
                }
            }
        }

        return dateTaken != null ? dateTaken.toDate() : null;
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public Location getGpsLocation() {
        Double x = getGpsDegrees(getValueForKey(String.class, GpsDirectory.GPS_LATITUDE), getValueForKey(String.class, GpsDirectory.GPS_LATITUDE_REF));
        Double y = getGpsDegrees(getValueForKey(String.class, GpsDirectory.GPS_LONGITUDE), getValueForKey(String.class, GpsDirectory.GPS_LONGITUDE_REF));
        return x != null && y != null ? new Location(x, y) : null;
    }

    /**
     * TODO: Javadocs
     */
    public void setOrientation() {
        // Work some magic to deal with photos with orientation metadata.
        String orientationKey = getValueForKey(String.class, ExifIfd0Directory.ORIENTATION);
        Integer orientationValue = EXIF_IMAGE_ORIENTATIONS.get(orientationKey);

        if (orientationValue != null) {

            switch (orientationValue) {
                case 1:
                    // do nothing
                    break;
                case 2:
                    CollectionUtils.putByPath(metadata, "cms.edits/flipH", true);
                    break;
                case 3:
                    CollectionUtils.putByPath(metadata, "cms.edits/flipH", true);
                    CollectionUtils.putByPath(metadata, "cms.edits/flipV", true);
                    break;
                case 4:
                    CollectionUtils.putByPath(metadata, "cms.edits/flipV", true);
                    break;
                case 5:
                    CollectionUtils.putByPath(metadata, "cms.edits/flipH", true);
                    CollectionUtils.putByPath(metadata, "cms.edits/rotate", -90);
                    break;
                case 6:
                    CollectionUtils.putByPath(metadata, "cms.edits/rotate", 90);
                    break;
                case 7:
                    CollectionUtils.putByPath(metadata, "cms.edits/flipH", true);
                    CollectionUtils.putByPath(metadata, "cms.edits/rotate", 90);
                    break;
                case 8:
                    CollectionUtils.putByPath(metadata, "cms.edits/rotate", -90);
                    break;
                default:
                    // do nothing
            }
        }
    }

    /**
     * TODO: Javadocs
     *
     * @return
     */
    public boolean isRotated90Degrees() {
        return Math.abs(ObjectUtils.to(int.class, CollectionUtils.getByPath(metadata, "cms.edits/rotate"))) == 90;
    }

    private Double getGpsDegrees(String dmsString, String dmsRef) {

        if (dmsString == null || dmsRef == null) {
            return null;
        }

        Double degrees = null;
        Double minutes = null;
        Double seconds = null;

        double sign = 1;

        // -39° 5' 13.2"
        String[] parts = dmsString.trim().split("\\s+");
        if (parts.length == 3) {

            for (int i = 0; i < parts.length; i++) {
                String part = parts[i];
                if (part.length() > 0 && !Character.isDigit(part.charAt(part.length() - 1))) {
                    parts[i] = part.substring(0, part.length() - 1);
                }
            }

            if (parts[0].startsWith("-")) {
                parts[0] = parts[0].substring(1);
                sign = -1;
            }

            degrees = ObjectUtils.to(Double.class, parts[0]);
            minutes = ObjectUtils.to(Double.class, parts[1]);
            seconds = ObjectUtils.to(Double.class, parts[2]);
        }

        if (degrees == null || minutes == null || seconds == null) {
            return null;
        }

        return (degrees + (minutes / 60) + (seconds / 3600)) * sign;
    }

    private <T> T getValueForKey(Class<T> returnType, MetadataField field) {
        return getValueForKey(returnType, field.getMetadataFieldKey());
    }

    /**
     * Double slashes in the path means that it's part of the key and NOT a
     * separator.
     */
    private <T> T getValueForKey(Class<T> returnType, String path) {

        // handle double slashes
        if (path.contains("//")) {

            Object subMetaData = metadata;
            // https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html#special
            for (String pathPart : path.split("(?<!/)/(?!/)")) {

                pathPart = pathPart.replaceAll("//", "/");

                if (subMetaData instanceof Map) {
                    subMetaData = ((Map<?, ?>) subMetaData).get(pathPart);
                } else {
                    subMetaData = CollectionUtils.getByPath(subMetaData, pathPart);
                }
            }
            return ObjectUtils.to(returnType, subMetaData);

        } else {
            return ObjectUtils.to(returnType, CollectionUtils.getByPath(metadata, path));
        }
    }

    /**
     * Takes an array of fields and gets the first non-blank value.
     * @see #getFirstNonBlankValueForKeys(Class, String...)
     */
    private <T> T getFirstNonBlankValueForKeys(Class<T> returnType, MetadataField... fields) {
        return getFirstNonBlankValueForKeys(returnType, Arrays.stream(fields).map(MetadataField::getMetadataFieldKey).toArray(String[]::new));
    }

    /**
     * Takes an array of paths and gets the first non-blank result of calling
     * {@link #getValueForKey(Class, String)}.
     */
    private <T> T getFirstNonBlankValueForKeys(Class<T> returnType, String... paths) {

        T value = null;

        for (String path : paths) {
            value = getValueForKey(returnType, path);
            if (!ObjectUtils.isBlank(value)) {
                break;
            }
        }

        return value;
    }
}
